'use server'

import { z } from 'zod'
import prisma from '@/lib/db'
import { createSession, deleteSession, verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { hash, compare } from 'bcryptjs'
import { headers } from 'next/headers'

import { generateVerificationToken, hashToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

// LOGIN SCHEMA
const loginSchema = z.object({
    email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
    password: z.string().min(3, { message: "كلمة المرور قصيرة جداً" }),
})

// REGISTER SCHEMA - PLAYER
const playerRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    displayName: z.string().min(2, "الاسم قصير جداً"),
    avatar: z.string().min(1, "يرجى اختيار رمز"),
    color: z.string().min(1, "يرجى اختيار لون"),
    bio: z.string().optional()
})

// REGISTER SCHEMA - ADMIN
const adminRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل ومؤمنة"),
    displayName: z.string().min(2, "الاسم قصير جداً"),
})

export async function login(prevState: unknown, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    const { email, password } = result.data

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        return { errors: { email: ['بيانات الدخول غير صحيحة'] } }
    }

    const isValid = await compare(password, user.passwordHash)

    if (!isValid) {
        return { errors: { email: ['بيانات الدخول غير صحيحة'] } }
    }

    // Check if email is verified
    if (!user.emailVerified) {
        // Redirect to a check-email page with the user's email as a param
        redirect(`/verify-email?email=${encodeURIComponent(user.email)}`)
    }

    await createSession(
        user.id,
        user.role,
        user.avatar || 'default',
        user.displayName || 'مستخدم'
    )

    if (user.role === 'ADMIN') {
        redirect('/admin/competitions')
    } else {
        redirect('/app/competitions')
    }
}

export async function registerPlayer(prevState: unknown, formData: FormData) {
    const rawData = Object.fromEntries(formData)
    const result = playerRegisterSchema.safeParse(rawData)

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    const { email, password, displayName, avatar, color, bio } = result.data

    // Check existing
    const existing = await prisma.user.findUnique({ where: { email } }) as any
    if (existing) {
        if (existing.emailVerified) {
            return { errors: { email: ['البريد الإلكتروني مسجل مسبقاً'] } }
        }
        // If not verified, delete the old incomplete registration to allow a fresh start
        await prisma.user.delete({ where: { id: existing.id } })
    }

    const hashedPassword = await hash(password, 10)

    try {
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                role: 'PLAYER',
                displayName,
                avatar,
                color,
                bio
            }
        })

        // Generate Token & Send Email
        const headerList = await headers()
        const ip = headerList.get('x-forwarded-for') || 'unknown'
        const userAgent = headerList.get('user-agent') || 'unknown'

        const token = await generateVerificationToken(user.id, ip, userAgent)
        const confirmLink = `https://fawazir.com/verify?token=${token}`

        console.log('-----------------------------------------')
        console.log('🔗 [DEV] رابط تفعيل الحساب:')
        console.log(confirmLink)
        console.log('-----------------------------------------')

        await sendVerificationEmail(user.email, token)
    } catch (error) {
        // If it's a redirect error, re-throw it so Next.js can handle it
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error;
        }
        console.error('Registration error:', error);
        return { errors: { email: ['حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً'] } }
    }

    // Redirect outside try-catch
    redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

export async function resendVerificationEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { emailVerifications: { orderBy: { createdAt: 'desc' }, take: 1 } }
    })

    if (!user || user.emailVerified) {
        return { error: "الطلب غير صالح" }
    }

    // Rate limiting: 60 seconds
    const lastVerification = user.emailVerifications[0]
    if (lastVerification && (Date.now() - lastVerification.createdAt.getTime() < 60000)) {
        const remaining = Math.ceil((60000 - (Date.now() - lastVerification.createdAt.getTime())) / 1000)
        return { error: `يرجى الانتظار ${remaining} ثانية قبل إعادة الإرسال` }
    }

    // Generate NEW Token & Send
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'
    const userAgent = headerList.get('user-agent') || 'unknown'

    const token = await generateVerificationToken(user.id, ip, userAgent)
    const emailRes = await sendVerificationEmail(user.email, token)

    if (!emailRes.success) {
        return { error: "فشل إرسال البريد الإلكتروني، يرجى المحاولة لاحقاً" }
    }

    return { success: true }
}

export async function registerAdmin(prevState: unknown, formData: FormData) {
    const rawData = Object.fromEntries(formData)
    const result = adminRegisterSchema.safeParse(rawData)

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    const { email, password, displayName } = result.data

    const existing = await prisma.user.findUnique({ where: { email } }) as any
    if (existing) {
        if (existing.emailVerified) {
            return { errors: { email: ['البريد الإلكتروني مسجل مسبقاً'] } }
        }
        // Delete unverified admin attempt
        await prisma.user.delete({ where: { id: existing.id } })
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            role: 'ADMIN',
            displayName
        }
    })

    // Admins might also need verification, let's keep it consistent
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'
    const userAgent = headerList.get('user-agent') || 'unknown'

    const token = await generateVerificationToken(user.id, ip, userAgent)
    const confirmLink = `https://fawazir.com/verify?token=${token}`

    console.log('-----------------------------------------')
    console.log('🔗 [DEV] رابط تفعيل المشرف:')
    console.log(confirmLink)
    console.log('-----------------------------------------')

    const emailRes = await sendVerificationEmail(user.email, token)

    if (!emailRes.success) {
        // We still redirect because the account is created, but inform or log?
        // Actually, for consistency let's just make sure redirect is outside if we use try-catch
        console.warn('⚠️ Admin verification email failed to send');
    }

    redirect(`/verify-email?email=${encodeURIComponent(user.email)}`)
}

export async function verifyEmail(token: string) {
    const tokenHash = hashToken(token)

    try {
        const verification = await (prisma as any).emailVerification.findUnique({
            where: { tokenHash },
            include: { user: true }
        })

        if (!verification || verification.usedAt || verification.expiresAt < new Date()) {
            return { error: "الرابط غير صالح أو انتهت صلاحيته" }
        }

        // Atomic transaction to verify user and mark token as used
        await (prisma as any).$transaction([
            (prisma as any).user.update({
                where: { id: verification.userId },
                data: { emailVerified: new Date() }
            }),
            (prisma as any).emailVerification.update({
                where: { id: verification.id },
                data: { usedAt: new Date() }
            })
        ])

        return { success: true }
    } catch (error) {
        console.error("❌ Verification Error Details:", error);
        return { error: "حدث خطأ أثناء تفعيل الحساب" }
    }
}

export async function checkVerificationStatus(email: string) {
    if (!email) return { verified: false }

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (user && user.emailVerified) {
        // Automatically create session since they just verified
        await createSession(
            user.id,
            user.role,
            user.avatar || 'default',
            user.displayName || 'مستخدم'
        )

        return {
            verified: true,
            role: user.role
        }
    }

    return { verified: false }
}

export async function updateDisplayName(name: string) {
    const session = await verifySession()
    if (!session.userId) return { error: "غير مصرح لك" }

    if (name.length < 2) return { error: "الاسم قصير جداً" }

    try {
        await prisma.user.update({
            where: { id: session.userId },
            data: { displayName: name }
        })
        return { success: true }
    } catch (error) {
        return { error: "حدث خطأ أثناء تحديث الاسم" }
    }
}

export async function updateEmail(email: string) {
    const session = await verifySession()
    if (!session.userId) return { error: "غير مصرح لك" }

    const emailSchema = z.string().email()
    const result = emailSchema.safeParse(email)
    if (!result.success) return { error: "البريد الإلكتروني غير صحيح" }

    try {
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) return { error: "البريد الإلكتروني مستخدم بالفعل" }

        await prisma.user.update({
            where: { id: session.userId },
            data: {
                email,
                emailVerified: null // Reset verification on email change
            }
        })

        // Return success but note they need to re-verify if needed
        return { success: true }
    } catch (error) {
        return { error: "حدث خطأ أثناء تحديث البريد" }
    }
}

export async function updatePassword(formData: FormData) {
    const session = await verifySession()
    if (!session.userId) return { error: "غير مصرح لك" }

    const oldPassword = formData.get('oldPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!oldPassword || !newPassword || !confirmPassword) return { error: "جميع الحقول مطلوبة" }
    if (newPassword !== confirmPassword) return { error: "كلمات المرور الجديدة غير متطابقة" }
    if (newPassword.length < 8) return { error: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل" }

    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user) return { error: "المستخدم غير موجود" }

    const isValid = await compare(oldPassword, user.passwordHash)
    if (!isValid) return { error: "كلمة المرور القديمة غير صحيحة" }

    const hashedNewPassword = await hash(newPassword, 10)

    try {
        await prisma.user.update({
            where: { id: session.userId },
            data: { passwordHash: hashedNewPassword }
        })
        return { success: true }
    } catch (error) {
        return { error: "حدث خطأ أثناء تحديث كلمة المرور" }
    }
}

export async function deleteAccount() {
    const session = await verifySession()
    if (!session.userId) return { error: "غير مصرح لك" }

    try {
        // Prisma transaction to clean up user and related data if needed
        await prisma.user.delete({
            where: { id: session.userId }
        })

        await deleteSession()
        return { success: true }
    } catch (error) {
        return { error: "حدث خطأ أثناء حذف الحساب" }
    }
}

export async function logout() {
    await deleteSession()
    redirect('/')
}
