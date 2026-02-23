import { verifySession } from '@/lib/session'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import ProgressPage from './ProgressPage'

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
    const session = await verifySession()
    if (session.role !== 'ADMIN') return <div>Access Denied</div>

    const { code } = await params

    const competition = await prisma.competition.findUnique({
        where: { code },
        include: {
            participants: {
                include: {
                    user: true,
                    team: true
                }
            }
        }
    })

    if (!competition) notFound()

    // Calculate simple stats
    const totalStars = competition.participants.reduce((acc, curr) => acc + (curr.stars || 0), 0)

    const totalSubmissions = await prisma.submission.count({
        where: {
            question: {
                day: {
                    competitionId: competition.id
                }
            }
        }
    })

    const totalQuestions = await prisma.question.count({
        where: {
            day: {
                competitionId: competition.id
            }
        }
    })

    const totalPossibleSubmissions = competition.participants.length * totalQuestions
    const engagement = totalPossibleSubmissions > 0
        ? Math.round((totalSubmissions / totalPossibleSubmissions) * 100)
        : 0

    return (
        <ProgressPage
            participants={competition.participants}
            stats={{
                totalStars,
                engagement
            }}
        />
    )
}
