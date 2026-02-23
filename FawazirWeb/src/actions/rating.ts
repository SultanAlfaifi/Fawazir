'use server'

import prisma from '@/lib/db'
import { verifySession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { syncUserStars } from '@/lib/score'

export async function rateSubmission(submissionId: string, stars: number, feedback: string) {
    const session = await verifySession()
    if (session.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required')
    }
    const submission = await prisma.submission.update({
        where: { id: submissionId },
        data: {
            ratingStars: stars,
            feedback: feedback
        },
        include: {
            user: {
                include: {
                    joinedCompetitions: {
                        where: {
                            competition: {
                                days: {
                                    some: {
                                        questions: {
                                            some: {
                                                submissions: {
                                                    some: { id: submissionId }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    // Update total stars on Participation record
    // We need to find the specific participation record for this user and this competition
    const question = await prisma.question.findUnique({
        where: { id: submission.questionId },
        include: { day: true }
    })

    if (question) {
        await syncUserStars(submission.userId, question.day.competitionId)
    }

    revalidatePath(`/admin/competition`)
    return { success: true }
}
