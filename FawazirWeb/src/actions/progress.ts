'use server'

import prisma from '@/lib/db'
import { verifySession } from '@/lib/session'
import { CHARACTER_THEMES, CharacterType } from '@/lib/theme'

export async function getLeaderboard() {
    await verifySession()

    const users = await prisma.user.findMany({
        where: { role: 'PLAYER' },
        select: {
            id: true,
            displayName: true,
            avatar: true,
            tasks: {
                where: { status: 'DONE' }
            }
        }
    })

    return users.map(u => ({
        id: u.id,
        name: u.displayName || 'Unknown',
        avatar: u.avatar as CharacterType,
        score: u.tasks.length,
        theme: CHARACTER_THEMES[u.avatar as CharacterType] || CHARACTER_THEMES.NAJM
    })).sort((a, b) => b.score - a.score)
}
