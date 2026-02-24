'use server'

import { z } from 'zod'
import prisma from '@/lib/db'
import { verifySession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

const joinSchema = z.object({
    code: z.string().length(8, "الرمز يجب أن يتكون من 8 أرقام")
})

export async function joinCompetition(prevState: unknown, formData: FormData) {
    const session = await verifySession()

    const result = joinSchema.safeParse({
        code: formData.get('code')
    })

    if (!result.success) {
        return { errors: { code: result.error.issues[0]?.message || 'الرمز غير صحيح' } }
    }

    const code = result.data.code

    // Find competition
    const competition = await prisma.competition.findUnique({
        where: { code }
    })

    if (!competition) {
        return { errors: { code: 'لم يتم العثور على مسابقة بهذا الرمز' } }
    }

    if (competition.status !== 'ACTIVE') {
        return { errors: { code: 'هذه المسابقة لم تعد نشطة' } }
    }

    // Check if already joined
    const existing = await prisma.participation.findFirst({
        where: {
            userId: session.userId,
            competitionId: competition.id
        }
    })

    if (existing) {
        return { message: 'أنت مسجل بالفعل في هذه المسابقة!' }
    }

    // Max 5 competitions check
    const count = await prisma.participation.count({
        where: { userId: session.userId }
    })

    if (count >= 5) {
        return { errors: { code: 'عفواً، الحد الأقصى للمسابقات هو 5' } }
    }

    // Join
    await prisma.participation.create({
        data: {
            userId: session.userId,
            competitionId: competition.id
        }
    })

    revalidatePath('/app/competitions')
    return { success: true }
}

const createSchema = z.object({
    title: z.string().min(3, "العنوان قصير جداً"),
    description: z.string().optional()
})

export async function createCompetition(prevState: unknown, formData: FormData) {
    const session = await verifySession()

    if (session.role !== 'ADMIN') {
        return { errors: { title: ['غير مصرح: فقط المشرفون يمكنهم إنشاء المسابقات'] } }
    }

    // Generate random 8-digit code
    let code = Math.floor(10000000 + Math.random() * 90000000).toString()

    // Ensure uniqueness (simple check, loop if collision)
    let exists = await prisma.competition.findUnique({ where: { code } })
    while (exists) {
        code = Math.floor(10000000 + Math.random() * 90000000).toString()
        exists = await prisma.competition.findUnique({ where: { code } })
    }

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description')
    }

    const result = createSchema.safeParse(rawData)

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    await prisma.competition.create({
        data: {
            code,
            title: result.data.title,
            description: result.data.description,
            ownerId: session.userId,
            status: 'ACTIVE'
        }
    })

    return { success: true, message: 'تم إنشاء المسابقة بنجاح', code }
}
