'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const bulkCreateSchema = z.object({
    duration: z.coerce.number().min(1).max(100),
})

interface DayTask {
    title: string
    url: string
    points: number
}

interface DaySettingsData {
    title?: string
    challengeTitle?: string
    challengeContent?: string
    visibilityType?: string
    unlockDate?: string | null
    isManualOpen?: boolean
    tasks?: DayTask[]
}

interface CompetitionSettingsData {
    startDate?: string | null
}

function buildDayTemplate(competitionId: string, dayNumber: number) {
    return {
        competitionId,
        dayNumber,
        title: `اليوم ${dayNumber}`,
        content: `محتوى اليوم ${dayNumber}`,
        challengeTitle: `تحدي اليوم ${dayNumber}`,
        challengeContent: `اكتب هنا تفاصيل التحدي لليوم ${dayNumber}`,
        isManualOpen: false,
    }
}

export async function createBulkDays(competitionId: string, formData: FormData) {
    const rawData = {
        duration: formData.get('duration'),
    }

    const result = bulkCreateSchema.safeParse(rawData)
    if (!result.success) return { error: "مدة غير صحيحة" }

    const duration = result.data.duration

    const daysData = Array.from({ length: duration }, (_, i) =>
        buildDayTemplate(competitionId, i + 1)
    )

    await prisma.day.createMany({
        data: daysData,
        skipDuplicates: true
    })

    revalidatePath(`/admin/competition`)
    return { success: true }
}

export async function updateDaySettings(dayId: string, data: DaySettingsData, path: string): Promise<void> {
    await prisma.day.update({
        where: { id: dayId },
        data: {
            title: data.title,
            challengeTitle: data.challengeTitle,
            challengeContent: data.challengeContent,
            visibilityType: data.visibilityType,
            unlockDate: data.unlockDate ? new Date(data.unlockDate) : null,
            isManualOpen: data.isManualOpen,
            ...(data.tasks !== undefined && { tasksJson: JSON.stringify(data.tasks) })
        }
    })
    revalidatePath(path)
}

export async function deleteDay(dayId: string, path: string): Promise<void> {
    await prisma.day.delete({
        where: { id: dayId }
    })
    revalidatePath(path)
}

export async function deleteAllDays(competitionId: string, path: string): Promise<void> {
    await prisma.day.deleteMany({
        where: { competitionId }
    })
    revalidatePath(path)
}

export async function addSingleDay(competitionId: string, path: string): Promise<void> {
    // Get last day number
    const lastDay = await prisma.day.findFirst({
        where: { competitionId },
        orderBy: { dayNumber: 'desc' },
        select: { dayNumber: true }
    })

    const nextNumber = (lastDay?.dayNumber || 0) + 1

    await prisma.day.create({
        data: buildDayTemplate(competitionId, nextNumber)
    })
    revalidatePath(path)
}

export async function updateCompetitionSettings(competitionId: string, data: CompetitionSettingsData, path: string): Promise<void> {
    await prisma.competition.update({
        where: { id: competitionId },
        data: {
            startDate: data.startDate ? new Date(data.startDate) : null,
        }
    })
    revalidatePath(path)
}

// Team management placeholder
export async function autoDistributeTeams(competitionId: string, teamCount: number, membersPerTeam: number) {
    // 1. Fetch participants
    const participants = await prisma.participation.findMany({
        where: { competitionId },
        select: { id: true }
    })

    if (participants.length === 0) return { error: "لا يوجد مشاركين" }

    // 2. Clear existing teams? or just create new ones
    // For simplicity, let's create N teams and distribute
    const teams = []
    for (let i = 1; i <= teamCount; i++) {
        const team = await prisma.team.create({
            data: {
                name: `فريق ${i}`,
                competitionId
            }
        })
        teams.push(team)
    }

    // 3. Distribute using Fisher-Yates shuffle for uniform distribution
    const shuffled = [...participants]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    for (let i = 0; i < shuffled.length; i++) {
        const teamIndex = Math.floor(i / membersPerTeam)
        if (teamIndex < teams.length) {
            await prisma.participation.update({
                where: { id: shuffled[i].id },
                data: { teamId: teams[teamIndex].id }
            })
        }
    }

    revalidatePath(`/admin/competition/${competitionId}/content`)
    return { success: true }
}

export async function assignPlayerToTeam(participationId: string, teamId: string | null, path: string): Promise<void> {
    await prisma.participation.update({
        where: { id: participationId },
        data: { teamId }
    })
    revalidatePath(path)
}

export async function reorderDays(orderedIds: string[], path: string) {
    try {
        await prisma.$transaction(async (tx) => {
            // Use a very large base to avoid ANY collision with existing dayNumbers
            const TEMP_BASE = 10000;

            // Step 1: Move everything to temp large numbers simultaneously
            await Promise.all(
                orderedIds.map((id, index) =>
                    tx.day.update({
                        where: { id },
                        data: { dayNumber: TEMP_BASE + index }
                    })
                )
            );

            // Step 2: Move back to final correct order
            await Promise.all(
                orderedIds.map((id, index) =>
                    tx.day.update({
                        where: { id },
                        data: { dayNumber: index + 1 }
                    })
                )
            );
        }, {
            maxWait: 5000,
            timeout: 15000,
        });

        revalidatePath(path);
        return { success: true };
    } catch (error) {
        console.error("Reorder Error:", error);
        return { error: "فشل في إعادة ترتيب الأيام" };
    }
}
