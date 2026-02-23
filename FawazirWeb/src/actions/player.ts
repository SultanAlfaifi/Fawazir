'use server'

import prisma from '@/lib/db'
import { verifySession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function getMyProfile() {
    const session = await verifySession()

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
            tasks: {
                orderBy: { createdAt: 'desc' },
                include: { day: true }
            },
            notifications: {
                orderBy: { createdAt: 'desc' },
                take: 20
            }
        }
    })
    return user
}

export async function toggleTaskStatus(taskId: string, currentStatus: string): Promise<void> {
    const session = await verifySession()
    const task = await prisma.task.findUnique({ where: { id: taskId } })

    if (!task || task.userId !== session.userId) return

    await prisma.task.update({
        where: { id: taskId },
        data: { status: currentStatus === 'DONE' ? 'TODO' : 'DONE' }
    })
    revalidatePath('/app/me')
}

export async function addBonusTask(formData: FormData): Promise<void> {
    const session = await verifySession()
    const title = formData.get('title') as string

    if (!title) return

    await prisma.task.create({
        data: {
            userId: session.userId,
            title: title.startsWith('بونس:') ? title : 'بونس: ' + title,
            status: 'DONE',
            isBonus: true,
        }
    })
    revalidatePath('/app/me')
}

export async function updateProfile(formData: FormData): Promise<void> {
    const session = await verifySession()
    const displayName = formData.get('displayName') as string
    const bio = formData.get('bio') as string

    if (displayName || bio) {
        await prisma.user.update({
            where: { id: session.userId },
            data: {
                displayName: displayName || undefined,
                bio: bio || undefined
            }
        })
    }
    revalidatePath('/app/me')
}

export async function markNotificationRead(notificationId: string): Promise<void> {
    const session = await verifySession()
    // Verify ownership
    const notif = await prisma.notification.findUnique({ where: { id: notificationId } })
    if (!notif || notif.userId !== session.userId) return

    await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
    })
    revalidatePath('/app')
}
