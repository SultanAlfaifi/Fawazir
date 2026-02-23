'use server'

import prisma from '@/lib/db'
import { verifySession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function sendAnnouncement(competitionId: string, message: string, type: string = 'INFO') {
    const session = await verifySession()

    // Verify caller is admin and owns this competition
    if (session.role !== 'ADMIN') {
        return { error: "غير مصرح لك بإرسال إشعارات" }
    }

    const competition = await prisma.competition.findUnique({
        where: { id: competitionId },
        select: { ownerId: true }
    })

    if (!competition || competition.ownerId !== session.userId) {
        return { error: "غير مصرح لك بإدارة هذه المسابقة" }
    }

    // Get all participants
    const participants = await prisma.participation.findMany({
        where: { competitionId },
        select: { userId: true }
    })

    // Create notifications for all
    const notifications = participants.map(p => ({
        userId: p.userId,
        message,
        type
    }))

    await prisma.notification.createMany({
        data: notifications
    })

    revalidatePath(`/admin/competition`)
    return { success: true }
}

export async function sendNotification(formData: FormData): Promise<void> {
    const session = await verifySession()

    if (session.role !== 'ADMIN') return

    const userId = formData.get('userId') as string
    const message = formData.get('message') as string
    const type = (formData.get('type') as string) || 'INFO'

    if (!message?.trim()) return

    if (userId === 'ALL') {
        const users = await prisma.user.findMany({ select: { id: true } })
        await prisma.notification.createMany({
            data: users.map(u => ({ userId: u.id, message, type }))
        })
    } else {
        await prisma.notification.create({
            data: { userId, message, type }
        })
    }

    revalidatePath('/admin/notifications')
}

export async function getNotificationsLog() {
    const session = await verifySession()

    if (session.role !== 'ADMIN') {
        return []
    }

    return await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
            user: { select: { displayName: true } }
        }
    })
}

export async function getUserNotifications() {
    const session = await verifySession()

    return await prisma.notification.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: 'desc' },
        take: 30
    })
}

export async function markAsRead(notificationId: string) {
    const session = await verifySession()

    await prisma.notification.update({
        where: {
            id: notificationId,
            userId: session.userId
        },
        data: { read: true }
    })

    revalidatePath('/app')
}

export async function markAllAsRead() {
    const session = await verifySession()

    await prisma.notification.updateMany({
        where: {
            userId: session.userId,
            read: false
        },
        data: { read: true }
    })

    revalidatePath('/app')
}
