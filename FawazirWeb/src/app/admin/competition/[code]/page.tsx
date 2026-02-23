import { verifySession } from '@/lib/session'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import AdminCompetitionPage from './AdminCompetitionPage'

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
    const session = await verifySession()
    if (session.role !== 'ADMIN') return <div>Access Denied</div>

    const { code } = await params

    // Fetch Competition with Days and Participants count
    const competition = await prisma.competition.findUnique({
        where: { code },
        include: {
            days: { orderBy: { dayNumber: 'asc' } },
            participants: { include: { user: true, team: true } },
            _count: { select: { participants: true, days: true } }
        }
    })

    if (!competition) notFound()

    // Fetch Recent Submissions for this competition
    const recentSubmissions = await prisma.submission.findMany({
        where: {
            question: {
                day: {
                    competitionId: competition.id
                }
            }
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: true,
            question: {
                include: {
                    day: true
                }
            }
        }
    })

    // Ensure the admin owns this competition
    if (competition.ownerId !== session.userId) {
        return <div>Access Denied: You do not own this competition.</div>
    }

    // Get Active Days Details
    const activeDaysCount = competition.days.filter(d => d.isManualOpen || (d.unlockDate && d.unlockDate <= new Date())).length

    // Get Submission and Question counts
    const submissionsCount = await prisma.submission.count({
        where: {
            question: {
                day: {
                    competitionId: competition.id
                }
            }
        }
    })

    const questionsCount = await prisma.question.count({
        where: {
            day: {
                competitionId: competition.id
            }
        }
    })

    const totalPossibleSubmissions = competition.participants.length * questionsCount
    const engagement = totalPossibleSubmissions > 0
        ? Math.round((submissionsCount / totalPossibleSubmissions) * 100)
        : 0

    return (
        <AdminCompetitionPage
            competition={competition}
            days={competition.days}
            participants={competition.participants}
            recentSubmissions={recentSubmissions}
            stats={{
                activeDays: activeDaysCount,
                totalParticipants: competition._count.participants,
                questionsCount,
                submissionsCount,
                engagement
            }}
            adminName={session.displayName || 'Admin'}
        />
    )
}
