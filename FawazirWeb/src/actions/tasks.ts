'use server'

import prisma from '@/lib/db'
import { verifySession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { syncUserStars } from '@/lib/score'


export async function toggleTask(taskId: string, completed: boolean) {
    const session = await verifySession()

    const task = await prisma.task.findUnique({
        where: { id: taskId }
    })

    if (!task || task.userId !== session.userId) {
        throw new Error("Unauthorized")
    }

    await prisma.task.update({
        where: { id: taskId },
        data: {
            status: completed ? 'DONE' : 'TODO',
        }
    })

    if (task.dayId) {
        const day = await prisma.day.findUnique({
            where: { id: task.dayId },
            select: { competitionId: true }
        })

        if (day) {
            await syncUserStars(session.userId, day.competitionId)
        }

        revalidatePath(`/app/day/${task.dayId}`)
    }
}

export async function toggleTaskByTitle(dayId: string, title: string, completed: boolean) {
    const session = await verifySession()

    // Find if task already exists
    const existingTask = await prisma.task.findFirst({
        where: {
            userId: session.userId,
            dayId: dayId,
            title: title
        }
    })

    if (existingTask) {
        await prisma.task.update({
            where: { id: existingTask.id },
            data: { status: completed ? 'DONE' : 'TODO' }
        })
    } else {
        await prisma.task.create({
            data: {
                userId: session.userId,
                dayId: dayId,
                title: title,
                status: completed ? 'DONE' : 'TODO',
                isBonus: false
            }
        })
    }

    const day = await prisma.day.findUnique({
        where: { id: dayId },
        select: { competitionId: true }
    })

    if (day) {
        await syncUserStars(session.userId, day.competitionId)
    }

    revalidatePath(`/app/day/${dayId}`)
}

export async function addBonus(dayId: string, title: string) {
    const session = await verifySession()

    await prisma.task.create({
        data: {
            userId: session.userId,
            dayId: dayId,
            title: title,
            isBonus: true,
            status: 'TODO'
        }
    })

    revalidatePath(`/app/day/${dayId}`)
}

export async function getMyTasks(dayId?: string) {
    const session = await verifySession()

    return await prisma.task.findMany({
        where: {
            userId: session.userId,
            ...(dayId ? { dayId } : {})
        },
        orderBy: { createdAt: 'desc' }
    })
}
