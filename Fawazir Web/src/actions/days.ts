'use server'

import { z } from 'zod'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'

// ─── getDays ──────────────────────────────────────────────────────────────────
// يجلب قائمة الأيام للمسابقة النشطة للاعب أو أحدث مسابقة انضم إليها
export async function getDays() {
    const session = await verifySession()

    // البحث عن أحدث مسابقة انضم إليها المستخدم
    const participation = await prisma.participation.findFirst({
        where: { userId: session.userId },
        orderBy: { joinedAt: 'desc' },
        select: { competitionId: true }
    })

    if (!participation) return []

    const days = await prisma.day.findMany({
        where: { competitionId: participation.competitionId },
        orderBy: { dayNumber: 'asc' }
    })

    return days.map(d => ({
        ...d,
        isOpen: !d.isManualLocked && (d.isManualOpen || (d.unlockDate !== null && d.unlockDate <= new Date())),
        openDateString: d.unlockDate?.toISOString() || d.createdAt.toISOString()
    }))
}

// ─── getDayDetails ────────────────────────────────────────────────────────────
// يجلب تفاصيل اليوم بواسطة id الحقيقي ويتحقق من صلاحية الوصول
export async function getDayDetails(dayId: string) {
    const session = await verifySession()

    const day = await prisma.day.findUnique({
        where: { id: dayId },
        include: {
            competition: {
                select: { id: true, code: true, ownerId: true }
            },
            questions: {
                include: {
                    submissions: { where: { userId: session.userId } }
                }
            }
        }
    })

    if (!day) redirect('/app/competitions')

    // التحقق من أن اللاعب مشترك في المسابقة
    const participation = await prisma.participation.findUnique({
        where: {
            userId_competitionId: {
                userId: session.userId,
                competitionId: day.competition.id
            }
        }
    })

    if (!participation) redirect('/app/competitions')

    // التحقق من أن اليوم مفتوح (isManualLocked يتغلب على أي شرط آخر)
    const isOpen =
        !day.isManualLocked && (
            day.isManualOpen ||
            (day.unlockDate !== null && day.unlockDate <= new Date()) ||
            day.visibilityType === 'AUTOMATIC'
        )

    if (!isOpen && session.role !== 'ADMIN') {
        redirect(`/app/competition/${day.competition.code}`)
    }

    // جلب مهام اللاعب لهذا اليوم
    const tasks = await prisma.task.findMany({
        where: { userId: session.userId, dayId: day.id },
        orderBy: { createdAt: 'asc' }
    })

    return { ...day, tasks }
}

// ─── getMyTeam ────────────────────────────────────────────────────────────────
// يجلب فريق اللاعب الحالي في المسابقة التي ينتمي إليها اليوم
export async function getMyTeam(dayId: string) {
    const session = await verifySession()

    const day = await prisma.day.findUnique({
        where: { id: dayId },
        select: { competitionId: true }
    })

    if (!day) return null

    const participation = await prisma.participation.findUnique({
        where: {
            userId_competitionId: {
                userId: session.userId,
                competitionId: day.competitionId
            }
        },
        include: {
            team: {
                include: {
                    members: {
                        include: { user: { select: { id: true, displayName: true, avatar: true } } },
                        where: { userId: { not: session.userId } }
                    }
                }
            }
        }
    })

    if (!participation?.team) return null

    return {
        id: participation.team.id,
        name: participation.team.name,
        members: participation.team.members.map(m => ({
            id: m.user.id,
            displayName: m.user.displayName,
            avatar: m.user.avatar
        }))
    }
}

// ─── getMyActiveTeam ────────────────────────────────────────────────────────
// يجلب الفريق "النشط" حالياً للاعب (أحدث فريق انضم إليه) ليظهر في الهيدر
export async function getMyActiveTeam() {
    const session = await verifySession()

    const participation = await prisma.participation.findFirst({
        where: {
            userId: session.userId,
            teamId: { not: null }
        },
        orderBy: { joinedAt: 'desc' },
        include: {
            team: {
                include: {
                    members: {
                        include: { user: { select: { id: true, displayName: true, avatar: true } } },
                        where: { userId: { not: session.userId } }
                    }
                }
            }
        }
    })

    if (!participation?.team) return null

    return {
        id: participation.team.id,
        name: participation.team.name,
        members: participation.team.members.map(m => ({
            id: m.user.id,
            displayName: m.user.displayName,
            avatar: m.user.avatar
        }))
    }
}

const daySchema = z.object({
    title: z.string().min(2, "العنوان قصير جداً"),
    dayNumber: z.coerce.number().min(1, "رقم اليوم غير صحيح"),
    content: z.string().optional(),
    unlockDate: z.string().optional()
})

export async function createDay(competitionId: string, prevState: any, formData: FormData) {
    const rawData = {
        title: formData.get('title'),
        dayNumber: formData.get('dayNumber'),
        content: formData.get('content'),
        unlockDate: formData.get('unlockDate')
    }

    const result = daySchema.safeParse(rawData)

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    await prisma.day.create({
        data: {
            competitionId,
            title: result.data.title,
            dayNumber: result.data.dayNumber,
            content: result.data.content,
            unlockDate: result.data.unlockDate ? new Date(result.data.unlockDate) : undefined,
            isManualOpen: false
        }
    })

    revalidatePath(`/admin/competition`)
    return { success: true, message: 'تم إضافة اليوم بنجاح' }
}

export async function toggleDayStatus(dayId: string, currentStatus: boolean, path: string) {
    await prisma.day.update({
        where: { id: dayId },
        data: { isManualOpen: !currentStatus }
    })
    revalidatePath(path)
}

export async function deleteDay(dayId: string, path: string) {
    await prisma.day.delete({ where: { id: dayId } })
    revalidatePath(path)
}

// ─── Chat Actions ─────────────────────────────────────────────────────────────

export async function getMessages(teamId: string) {
    const session = await verifySession()

    // التحقق من أن المستخدم في الفريق
    const isMember = await prisma.participation.findFirst({
        where: {
            userId: session.userId,
            teamId: teamId
        }
    })

    if (!isMember && session.role !== 'ADMIN') {
        throw new Error('غير مصرح لك بالوصول لهذه الرسائل')
    }

    const messages = await prisma.chatMessage.findMany({
        where: { teamId },
        include: {
            sender: {
                select: {
                    displayName: true,
                    avatar: true
                }
            }
        },
        orderBy: { createdAt: 'asc' }
    })

    // تحويل avatar إلى character لتوافق الواجهة إذا لزم الأمر
    return messages.map(m => ({
        ...m,
        sender: {
            displayName: m.sender.displayName,
            character: m.sender.avatar // mapping avatar to character
        }
    }))
}

export async function sendMessage(teamId: string, text: string) {
    const session = await verifySession()

    if (!text || text.trim().length === 0) {
        throw new Error('الرسالة فارغة')
    }
    if (text.length > 1000) {
        throw new Error('الرسالة طويلة جداً')
    }

    // التحقق من أن المستخدم في الفريق
    const isMember = await prisma.participation.findFirst({
        where: {
            userId: session.userId,
            teamId: teamId
        }
    })

    if (!isMember) {
        throw new Error('غير مصرح لك بإرسال رسائل لهذا الفريق')
    }

    return await prisma.chatMessage.create({
        data: {
            teamId,
            senderId: session.userId,
            text
        }
    })
}
