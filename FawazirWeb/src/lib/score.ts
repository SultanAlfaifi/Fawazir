import prisma from './db'

/**
 * Calculates and synchronizes the total stars for a participant in a specific competition.
 * Stars are the sum of:
 * 1. Stars awarded to rated submissions (questions).
 * 2. Points assigned to completed tasks.
 */
export async function syncUserStars(userId: string, competitionId: string) {
    // 1. Sum stars from rated submissions
    const submissions = await prisma.submission.findMany({
        where: {
            userId,
            ratingStars: { not: null },
            question: {
                day: {
                    competitionId
                }
            }
        },
        select: { ratingStars: true }
    })

    const submissionStars = submissions.reduce((sum, s) => sum + (s.ratingStars || 0), 0)

    // 2. Sum points from completed tasks
    const completedTasks = await prisma.task.findMany({
        where: {
            userId,
            status: 'DONE',
            day: {
                competitionId
            }
        },
        include: {
            day: true
        }
    })

    let taskPoints = 0
    for (const task of completedTasks) {
        try {
            if (!task.day) continue
            const tasksJson = JSON.parse(task.day.tasksJson || '[]')
            const taskDef = tasksJson.find((t: any) => t.title === task.title)
            if (taskDef) {
                // Ensure we use the points from the definition, default to 10 if missing
                taskPoints += Number(taskDef.points || 10)
            }
        } catch (err) {
            console.error('Error parsing tasksJson for day:', task.dayId, err)
        }
    }

    const totalStars = submissionStars + taskPoints

    // 3. Update the Participation record
    await prisma.participation.update({
        where: {
            userId_competitionId: {
                userId,
                competitionId
            }
        },
        data: {
            stars: totalStars
        }
    })

    return totalStars
}
