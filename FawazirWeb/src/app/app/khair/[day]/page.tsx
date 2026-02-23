import { getKhairProgress } from '@/actions/khair'
import { KhairForm } from '@/components/khair/KhairForm'
import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getDays } from '@/actions/days'

export default async function KhairDayPage({ params }: { params: Promise<{ day: string }> }) {
    const { day } = await params
    const session = await verifySession()
    const dayNumber = parseInt(day)

    if (isNaN(dayNumber)) redirect('/app/khair')

    // Verify day is open
    const days = await getDays()
    const targetDay = days.find(d => d.dayNumber === dayNumber)
    if (!targetDay || !targetDay.isOpen) {
        if (session.role !== 'ADMIN') {
            redirect('/app/khair')
        }
    }

    const { entries, allJuz, allHadiths } = await getKhairProgress()
    const currentEntry = entries.find((e: any) => e.dayNumber === dayNumber) || {
        completedJuz: [] as number[],
        completedHadith: [] as number[],
        charityDeeds: [] as string[],
        charityScore: 0
    }

    return (
        <div className="min-h-screen bg-[#F0F9FF] -mx-4 -mt-4 md:-mx-8 md:-mt-8 p-6 md:p-8">
            <KhairForm
                dayNumber={dayNumber}
                initialData={currentEntry as any}
                allCompletedJuz={allJuz as number[]}
                allCompletedHadiths={allHadiths as number[]}
            />
        </div>
    )
}
