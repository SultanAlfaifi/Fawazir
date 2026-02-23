import { verifySession } from '@/lib/session'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import ContentManagementClient from './ContentManagementClient'

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
    const session = await verifySession()
    if (session.role !== 'ADMIN') return <div>Access Denied</div>

    const { code } = await params

    const competition = await prisma.competition.findUnique({
        where: { code },
        include: {
            days: {
                orderBy: { dayNumber: 'asc' }
            },
            participants: {
                include: {
                    user: true,
                    team: true
                }
            },
            teams: true
        }
    })

    if (!competition) notFound()

    if (competition.ownerId !== session.userId) {
        return <div>Access Denied: You do not own this competition.</div>
    }

    return (
        <ContentManagementClient
            competition={competition}
            days={competition.days}
            participants={competition.participants}
            teams={competition.teams || []}
        />
    )
}
