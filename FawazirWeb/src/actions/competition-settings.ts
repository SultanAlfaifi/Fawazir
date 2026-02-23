'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateCompetitionBasicInfo(id: string, data: { title: string, description: string }) {
    await prisma.competition.update({
        where: { id },
        data: {
            title: data.title,
            description: data.description
        }
    })
    revalidatePath(`/admin/competition`)
    return { success: true }
}

export async function updateCompetitionCode(id: string, newCode: string) {
    // Check if code exists
    const exists = await prisma.competition.findUnique({ where: { code: newCode } })
    if (exists) return { error: "هذا الرمز مستخدم بالفعل" }

    await prisma.competition.update({
        where: { id },
        data: { code: newCode }
    })

    // Path includes code, so redirecting might be needed if we want to follow new URL
    // But for now just revalidate
    revalidatePath(`/admin/competition`)
    return { success: true }
}

export async function deleteCompetition(id: string) {
    await prisma.competition.delete({ where: { id } })
    redirect('/admin/competitions')
}
