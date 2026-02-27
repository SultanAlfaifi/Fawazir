'use server';

import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '../constants';
import { revalidatePath } from 'next/cache';

export async function getUserDetails(userId: string) {
    const cookieStore = await cookies();
    const isAuth = cookieStore.get(COOKIE_NAME)?.value === 'authenticated';
    if (!isAuth) {
        return { error: 'غير مصرح' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                displayName: true,
                bio: true,
                createdAt: true,
                emailVerified: true,
                avatar: true,
                color: true,
                _count: {
                    select: {
                        myCompetitions: true,
                        joinedCompetitions: true,
                        submissions: true,
                        chatMessages: true,
                        tasks: true
                    }
                },
                myCompetitions: {
                    select: {
                        id: true,
                        title: true,
                        code: true,
                        status: true,
                        _count: {
                            select: { participants: true, teams: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                joinedCompetitions: {
                    select: {
                        totalScore: true,
                        stars: true,
                        team: { select: { name: true } },
                        competition: {
                            select: {
                                id: true,
                                title: true,
                                code: true,
                                status: true,
                                owner: {
                                    select: {
                                        id: true,
                                        displayName: true,
                                        email: true,
                                        avatar: true,
                                        color: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { joinedAt: 'desc' }
                }
            }
        });

        if (!user) return { error: 'المستخدم غير موجود' };
        return { success: true, user };
    } catch (error) {
        console.error("❌ getUserDetails Error:", error);
        return { error: 'حدث خطأ أثناء جلب التفاصيل' };
    }
}

export async function deleteUser(userId: string) {
    const cookieStore = await cookies();
    const isAuth = cookieStore.get(COOKIE_NAME)?.value === 'authenticated';
    if (!isAuth) {
        return { error: 'غير مصرح' };
    }

    try {
        // Manually delete dependent records to avoid Foreign Key constraint errors
        // for relations that don't have onDelete: Cascade in Prisma schema
        await prisma.$transaction(async (tx) => {
            // Ensure we clean up competitions if this user is an admin
            const ownedCompetitions = await tx.competition.findMany({
                where: { ownerId: userId },
                select: { id: true }
            });

            if (ownedCompetitions.length > 0) {
                const compIds = ownedCompetitions.map(c => c.id);

                // Submissions do not cascade on question delete, so we must find and delete them
                const questions = await tx.question.findMany({
                    where: { day: { competitionId: { in: compIds } } },
                    select: { id: true }
                });
                const questionIds = questions.map(q => q.id);

                if (questionIds.length > 0) {
                    await tx.submission.deleteMany({
                        where: { questionId: { in: questionIds } }
                    });
                }

                // Participations do not cascade on competition delete
                await tx.participation.deleteMany({
                    where: { competitionId: { in: compIds } }
                });

                // Now we can safely delete the competitions (cascades handle Days, Teams, etc.)
                await tx.competition.deleteMany({
                    where: { ownerId: userId }
                });
            }

            // Normal user cleanup
            await tx.participation.deleteMany({ where: { userId } });
            await tx.submission.deleteMany({ where: { userId } });
            await tx.notification.deleteMany({ where: { userId } });

            // Delete the user itself (cascade will handle DayTeamAssignment, ChatMessage, Task, DailyEvaluation, KhairEntry, EmailVerification)
            await tx.user.delete({ where: { id: userId } });
        });

        revalidatePath('/analytics/users');
        return { success: true };
    } catch (error: any) {
        console.error("❌ Delete User Error:", error);
        if (error.code === 'P2003') {
            return { error: 'لا يمكن حذف هذا المستخدم لأنه يملك مسابقات مرتبطة به.' };
        }
        return { error: 'حدث خطأ أثناء محاولة حذف بيانات المستخدم.' };
    }
}
