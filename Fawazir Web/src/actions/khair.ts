'use server'

import prisma from '@/lib/db'
import { verifySession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function saveKhairEntry(data: {
    dayNumber: number
    completedJuz?: number[]
    completedHadith?: number[]
    charityDeeds?: string[]
}) {
    const session = await verifySession()
    const { dayNumber, completedJuz = [], completedHadith = [], charityDeeds = [] } = data

    // Points calculation: Juz * 100, Hadith * 50
    // Charity score is added later by admin
    const basePoints = (completedJuz.length * 100) + (completedHadith.length * 50)

    // 1. Get existing entry to preserve charityScore if it exists
    const existing = await prisma.khairEntry.findUnique({
        where: { userId_dayNumber: { userId: session.userId, dayNumber } }
    })

    const charityScore = existing?.charityScore || 0
    const finalPoints = basePoints + charityScore

    // 2. Perform the upsert with the calculated final points
    const entry = await prisma.khairEntry.upsert({
        where: {
            userId_dayNumber: {
                userId: session.userId,
                dayNumber
            }
        },
        update: {
            completedJuz,
            completedHadith,
            charityDeeds,
            points: finalPoints
        },
        create: {
            userId: session.userId,
            dayNumber,
            completedJuz,
            completedHadith,
            charityDeeds,
            points: finalPoints,
            charityScore: 0
        }
    })

    revalidatePath('/app/khair')
    return entry
}

export async function getKhairProgress() {
    const session = await verifySession()

    const entries = await prisma.khairEntry.findMany({
        where: { userId: session.userId },
        orderBy: { dayNumber: 'asc' }
    })

    // Calculate all-time unique Juz and Hadiths for highlighting
    const allJuz = [...new Set(entries.flatMap((e: any) => e.completedJuz))]
    const allHadiths = [...new Set(entries.flatMap((e: any) => e.completedHadith))]

    return { entries, allJuz, allHadiths }
}

export async function adminRateCharity(userId: string, dayNumber: number, charityScore: number) {
    const session = await verifySession()
    if (session.role !== 'ADMIN') throw new Error('Unauthorized')

    const entry = await prisma.khairEntry.findUnique({
        where: { userId_dayNumber: { userId, dayNumber } }
    })

    if (!entry) throw new Error('Entry not found')

    const basePoints = (entry.completedJuz.length * 100) + (entry.completedHadith.length * 50)

    const updated = await prisma.khairEntry.update({
        where: { id: entry.id },
        data: {
            charityScore,
            points: basePoints + charityScore
        }
    })

    revalidatePath('/admin/khair')
    revalidatePath('/app/khair')

    return updated
}

export async function getKhairLeaderboard() {
    await verifySession()

    const users = await prisma.user.findMany({
        where: { role: 'PLAYER' },
        select: {
            id: true,
            displayName: true,
            avatar: true,
            khairEntries: true
        }
    })

    return users.map((u) => {
        const totalPoints = u.khairEntries.reduce((sum, e) => sum + e.points, 0)
        return {
            id: u.id,
            name: u.displayName || 'Unknown',
            avatar: u.avatar,
            score: totalPoints
        }
    }).sort((a, b) => b.score - a.score)
}

export async function adminBulkRateCharity(userIds: string[], dayNumber: number, charityScore: number) {
    const session = await verifySession()
    if (session.role !== 'ADMIN') throw new Error('Unauthorized')

    for (const userId of userIds) {
        const entry = await prisma.khairEntry.findUnique({
            where: { userId_dayNumber: { userId, dayNumber } }
        })

        if (entry) {
            const basePoints = (entry.completedJuz.length * 100) + (entry.completedHadith.length * 50)
            await prisma.khairEntry.update({
                where: { id: entry.id },
                data: {
                    charityScore,
                    points: basePoints + charityScore
                }
            })
        }
    }

    revalidatePath('/admin/khair')
    revalidatePath('/app/khair')
}

export async function adminOverridePoints(userId: string, dayNumber: number, points: number) {
    const session = await verifySession()
    if (session.role !== 'ADMIN') throw new Error('Unauthorized')

    const updated = await prisma.khairEntry.update({
        where: { userId_dayNumber: { userId, dayNumber } },
        data: { points }
    })

    revalidatePath('/admin/khair')
    return updated
}

export async function adminDeleteKhairEntry(userId: string, dayNumber: number) {
    const session = await verifySession()
    if (session.role !== 'ADMIN') throw new Error('Unauthorized')

    await prisma.khairEntry.delete({
        where: { userId_dayNumber: { userId, dayNumber } }
    })

    revalidatePath('/admin/khair')
    revalidatePath('/app/khair')
}
