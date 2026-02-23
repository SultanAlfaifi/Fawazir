'use server'

import { z } from 'zod'
import prisma from '@/lib/db'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { hash, compare } from 'bcryptjs'

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
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        return { errors: { email: ['البريد الإلكتروني مسجل مسبقاً'] } }
    }

    const hashedPassword = await hash(password, 10)

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

    await createSession(user.id, user.role, user.avatar!, user.displayName!)
    redirect('/app/competitions')
}

export async function registerAdmin(prevState: unknown, formData: FormData) {
    const rawData = Object.fromEntries(formData)
    const result = adminRegisterSchema.safeParse(rawData)

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    const { email, password, displayName } = result.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        return { errors: { email: ['البريد الإلكتروني مسجل مسبقاً'] } }
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

    await createSession(user.id, user.role, user.avatar || 'admin', user.displayName!)
    redirect('/admin/competitions')
}


export async function logout() {
    await deleteSession()
    redirect('/')
}
