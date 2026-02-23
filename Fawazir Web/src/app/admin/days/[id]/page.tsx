import { getDayDetails } from '@/actions/days'
import { getDayTeams, getAllPlayers } from '@/actions/admin'
import { notFound } from 'next/navigation'
import EditDayClientPage from './EditDayClient'

export default async function EditDayPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const dayNumber = parseInt(id)
    let day: any
    try {
        day = await getDayDetails(id)
    } catch (e) {
        return notFound()
    }

    if (!day) return notFound()

    // Fetch initial data on server
    const initialTeams = await getDayTeams(dayNumber)
    const allPlayers = await getAllPlayers()

    return (
        <EditDayClientPage
            day={day}
            initialTeams={initialTeams}
            allPlayers={allPlayers}
        />
    )
}
