import { getDayTeams, deleteTeam, generateTeams, getAllPlayers } from '@/actions/admin'
import { getDayDetails } from '@/actions/days'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Users, Trash2, UserPlus, RefreshCcw, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ManualTeamForm } from '@/components/admin/ManualTeamForm'

export default async function AdminTeamsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const dayNumber = parseInt(id)

    let day
    try {
        day = await getDayDetails(id)
    } catch (e) {
        return notFound()
    }

    if (!day) return notFound()

    const teams = await getDayTeams(dayNumber)
    const allPlayers = await getAllPlayers()

    // Calculate unassigned players
    const assignedPlayerIds = new Set(teams.flatMap((t: any) => t.members.map((m: any) => m.id)))
    const unassignedPlayers = allPlayers.filter(p => !assignedPlayerIds.has(p.id))

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/days" className="p-2 hover:bg-white/5 rounded-xl text-gray-400 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white">إدارة أفرقة اليوم {day.dayNumber}</h1>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{day.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <form action={generateTeams.bind(null, day.id)}>
                        <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-black rounded-2xl font-black text-xs hover:bg-amber-400 transition-all active:scale-95 shadow-xl shadow-amber-500/20">
                            <RefreshCcw className="w-4 h-4" />
                            <span>توزيع عشوائي للجميع</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Manual Form */}
            <ManualTeamForm dayId={day.id} unassignedPlayers={unassignedPlayers} />

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <div className="w-20 h-20 rounded-full bg-gray-900 border border-white/5 flex items-center justify-center mx-auto">
                            <Users className="w-10 h-10 text-gray-700" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-white">لا توجد أفرقة حالياً</h3>
                            <p className="text-gray-500 text-sm font-medium">اضغط على زر إعادة التوزيع لإنشاء أفرقة لهذا اليوم.</p>
                        </div>
                    </div>
                )}

                {teams.map((team: any, idx: number) => (
                    <div key={team.id} className="group relative bg-[#0D0D11] border border-white/5 rounded-[2.5rem] p-6 hover:border-amber-500/30 transition-all hover:bg-amber-500/[0.02]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="px-4 py-1.5 rounded-xl bg-gray-900 border border-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                فريق #{idx + 1}
                            </div>
                            <form action={deleteTeam.bind(null, team.id)}>
                                <button className="p-2 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </form>
                        </div>

                        <div className="space-y-4">
                            {team.members.map((member: any, midx: number) => (
                                <div key={member.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center font-black text-white text-xs">
                                        {midx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0 text-right">
                                        <p className="text-sm font-black text-white truncate">{member.displayName || 'لاعب مجهول'}</p>
                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">@{member.email.split('@')[0]}</p>
                                    </div>
                                    {member.role === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-amber-500" />}
                                </div>
                            ))}

                            {team.members.length === 1 && (
                                <div className="p-3 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-gray-600">
                                    <UserPlus className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">بانتظار شريك</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
