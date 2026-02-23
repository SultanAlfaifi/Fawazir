'use server'

import prisma from '@/lib/db'
import { verifySession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function saveDailyEvaluation(userId: string, dayId: string, score: number, feedback?: string) {
    const session = await verifySession()
    if (session.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    const evaluation = await prisma.dailyEvaluation.upsert({
        where: {
            userId_dayId: {
                userId,
                dayId
            }
        },
        update: {
            score,
            feedback,
            updatedAt: new Date()
        },
        create: {
            userId,
            dayId,
            score,
            feedback
        }
    })

    // Create a notification for the player
    await prisma.notification.create({
        data: {
            userId,
            message: `تم تقييم أدائك لليوم بنتيجة ${score}/100`,
            type: 'INFO'
        }
    })

    revalidatePath('/admin/progress')
    revalidatePath('/app/overview')

    return evaluation
}

export async function getPlayerEvaluations(userId: string) {
    const evaluations = await prisma.dailyEvaluation.findMany({
        where: { userId },
        include: {
            day: true
        },
        orderBy: {
            day: {
                dayNumber: 'asc'
            }
        }
    })
    return evaluations
}
