'use server'

import prisma from '@/lib/db'
import { verifySession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function verifyAdmin() {
    const session = await verifySession()
    if (session.role !== 'ADMIN') {
        throw new Error("Unauthorized: Admin access required")
    }
}

export async function updateDay(dayId: string, formData: FormData) {
    await verifyAdmin()

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const challengeTitle = formData.get('challengeTitle') as string
    const challengeContent = formData.get('challengeContent') as string
    const manualOverride = formData.get('manualOverride') as string // 'AUTO' | 'OPEN' | 'LOCKED'
    const isTeamsEnabled = formData.get('isTeamsEnabled') === 'on'

    let isManualOpen = false
    let isManualLocked = false

    if (manualOverride === 'OPEN') isManualOpen = true
    if (manualOverride === 'LOCKED') isManualLocked = true

    // If toggled off, delete all existing team assignments for this day
    if (!isTeamsEnabled) {
        await prisma.dayTeamAssignment.deleteMany({
            where: { dayId }
        })
    }

    const day = await prisma.day.update({
        where: { id: dayId },
        data: {
            title,
            content,
            challengeTitle,
            challengeContent,
            isManualOpen,
            isManualLocked,
            isTeamsEnabled,
        }
    })

    revalidatePath('/admin/days')
    revalidatePath(`/admin/days/${day.id}`)
    revalidatePath(`/admin/days/${day.dayNumber}`)
    revalidatePath(`/app`)
}

export async function toggleDayStatus(dayId: string, status: 'OPEN' | 'LOCKED' | 'AUTO') {
    await verifyAdmin()

    await prisma.day.update({
        where: { id: dayId },
        data: {
            isManualOpen: status === 'OPEN',
            isManualLocked: status === 'LOCKED'
        }
    })
    revalidatePath('/admin/days')
    revalidatePath('/app')
}

export async function getUsers() {
    await verifyAdmin()
    return await prisma.user.findMany({
        where: { role: 'PLAYER' },
        orderBy: { displayName: 'asc' }
    })
}

export async function assignTask(formData: FormData) {
    await verifyAdmin()

    const title = formData.get('title') as string
    const dayId = formData.get('dayId') as string
    const userId = formData.get('userId') as string // 'ALL' or specific ID

    if (!title || !dayId) return

    if (userId === 'ALL') {
        const users = await prisma.user.findMany({ where: { role: 'PLAYER' } })

        // Create tasks
        await prisma.task.createMany({
            data: users.map(u => ({
                title,
                dayId,
                userId: u.id,
                status: 'TODO',
            }))
        })

        // Create notifications
        await prisma.notification.createMany({
            data: users.map(u => ({
                userId: u.id,
                message: `تم إضافة مهمة جديدة: ${title}`,
                type: 'TASK'
            }))
        })
    } else {
        await prisma.task.create({
            data: {
                title,
                dayId,
                userId,
                status: 'TODO',
            }
        })

        await prisma.notification.create({
            data: {
                userId,
                message: `تم إضافة مهمة جديدة: ${title}`,
                type: 'TASK'
            }
        })
    }
    revalidatePath('/admin/tasks')
    revalidatePath('/app')
}

export async function deleteTask(taskId: string) {
    await verifyAdmin()
    await prisma.task.delete({ where: { id: taskId } })
    revalidatePath('/admin/tasks')
    revalidatePath('/app')
}

export async function getAdminTasks(dayId?: string, userId?: string) {
    await verifyAdmin()
    return await prisma.task.findMany({
        where: {
            ...(dayId ? { dayId } : {}),
            ...(userId && userId !== 'ALL' ? { userId } : {})
        },
        include: { user: true, day: true }, // Join to show who it belongs to
        orderBy: [{ createdAt: 'desc' }]
    })
}

export async function toggleTaskComplete(taskId: string, forceStatus: 'DONE' | 'TODO') {
    await verifyAdmin()
    await prisma.task.update({
        where: { id: taskId },
        data: { status: forceStatus }
    })
    revalidatePath('/admin/tasks')
    revalidatePath('/admin/progress')
    revalidatePath('/app')
}

export async function createTeamManually(dayId: string, userIds: string[], teamName: string) {
    await verifyAdmin()

    const day = await prisma.day.findUnique({ where: { id: dayId } })
    if (!day) throw new Error("Day not found")

    const team = await prisma.team.create({
        data: {
            name: teamName,
            competitionId: day.competitionId,
        }
    })

    await prisma.dayTeamAssignment.createMany({
        data: userIds.map(userId => ({
            dayId,
            teamId: team.id,
            userId
        }))
    })

    revalidatePath(`/admin/days/${day.dayNumber}/teams`)
}

export async function getAllPlayers() {
    await verifyAdmin()
    return await prisma.user.findMany({
        where: { role: 'PLAYER' }
    })
}

export async function getDayTeams(dayNumber: number) {
    await verifyAdmin()

    // Returning DayTeamAssignments grouped by team might be better, but let's see.
    // The current UI expects teams with members.
    const assignments = await prisma.dayTeamAssignment.findMany({
        where: { day: { dayNumber } },
        include: {
            team: true,
            user: true
        }
    })

    // Grouping manually for compatibility
    const teamsMap = new Map()
    assignments.forEach(a => {
        if (!teamsMap.has(a.teamId)) {
            teamsMap.set(a.teamId, { ...a.team, members: [] })
        }
        teamsMap.get(a.teamId).members.push(a.user)
    })

    return Array.from(teamsMap.values())
}

export async function deleteTeam(teamId: string) {
    await verifyAdmin()

    // First delete assignments and messages
    await prisma.dayTeamAssignment.deleteMany({ where: { teamId } })
    await prisma.chatMessage.deleteMany({ where: { teamId } })
    await prisma.team.delete({ where: { id: teamId } })

    revalidatePath('/admin/days')
}

export async function toggleDayTeams(dayId: string, enabled: boolean) {
    await verifyAdmin()

    await prisma.day.update({
        where: { id: dayId },
        data: { isTeamsEnabled: enabled }
    })
    revalidatePath('/admin/days')
    revalidatePath('/app')
}

export async function generateTeams(dayId: string) {
    await verifyAdmin()

    const day = await prisma.day.findUnique({
        where: { id: dayId },
    })

    if (!day) throw new Error("Day not found")

    // Delete existing assignments for this day
    await prisma.dayTeamAssignment.deleteMany({
        where: { dayId: day.id }
    })

    const users = await prisma.user.findMany({
        where: { role: 'PLAYER' }
    })

    // Shuffle users
    const shuffled = [...users]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Create teams of 2 and assign
    for (let i = 0; i < shuffled.length; i += 2) {
        const member1 = shuffled[i]
        const member2 = shuffled[i + 1]

        if (member1) {
            const team = await prisma.team.create({
                data: {
                    name: `فريق ${day.dayNumber} - ${i / 2 + 1}`,
                    competitionId: day.competitionId,
                }
            })

            await prisma.dayTeamAssignment.create({
                data: {
                    dayId: day.id,
                    teamId: team.id,
                    userId: member1.id
                }
            })

            if (member2) {
                await prisma.dayTeamAssignment.create({
                    data: {
                        dayId: day.id,
                        teamId: team.id,
                        userId: member2.id
                    }
                })
            }
        }
    }

    revalidatePath('/admin/days')
    revalidatePath('/app')
}

export async function updateSettings(_formData: FormData) {
    await verifyAdmin()
    revalidatePath('/admin/settings')
    revalidatePath('/app')
}
