import { PrismaClient } from '@prisma/client'
import { verifySession } from '@/lib/session'
import { Heart, Book, Sparkles, User as UserIcon, CheckCircle2, TrendingUp, Trophy, AlertCircle, Calendar, Users, BarChart3 } from 'lucide-react'
import { KhairRatingInput } from '@/components/admin/KhairRatingInput'
import { cn } from '@/lib/utils'

const prisma = new PrismaClient()

export default async function AdminKhairPage() {
    await verifySession()

    // Fetch players and their khair entries
    const players = await prisma.user.findMany({
        where: { role: 'PLAYER' },
        include: {
            khairEntries: {
                orderBy: { dayNumber: 'asc' }
            }
        }
    }) as any[]

    // Calculate Global Statistics
    const totalJuz = players.reduce((sum, p) => sum + p.khairEntries.reduce((s: number, e: any) => s + e.completedJuz.length, 0), 0)
    const totalHadith = players.reduce((sum, p) => sum + p.khairEntries.reduce((s: number, e: any) => s + e.completedHadith.length, 0), 0)
    const totalPoints = players.reduce((sum, p) => sum + p.khairEntries.reduce((s: number, e: any) => s + e.points, 0), 0)
    const pendingCount = players.reduce((sum, p) => sum + p.khairEntries.filter((e: any) => e.charityDeeds.length > 0 && e.charityScore === 0).length, 0)

    // Daily Completion Stats (For the current/latest day)
    const latestDay = Math.max(...players.flatMap(p => p.khairEntries.map((e: any) => e.dayNumber)), 1)
    const dailyEntries = players.map(p => p.khairEntries.find((e: any) => e.dayNumber === latestDay)).filter(Boolean)
    const quranCompletionRate = dailyEntries.length > 0 ? (dailyEntries.filter((e: any) => e.completedJuz.length > 0).length / players.length) * 100 : 0
    const hadithCompletionRate = dailyEntries.length > 0 ? (dailyEntries.filter((e: any) => e.completedHadith.length > 0).length / players.length) * 100 : 0

    // Prepare Leaderboard
    const leaderboard = players
        .map(p => ({
            id: p.id,
            name: p.displayName || 'لاعب مجهول',
            totalPoints: p.khairEntries.reduce((s: number, e: any) => s + e.points, 0),
            juzCount: p.khairEntries.reduce((s: number, e: any) => s + e.completedJuz.length, 0),
            hadithCount: p.khairEntries.reduce((s: number, e: any) => s + e.completedHadith.length, 0),
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 5)

    const days = Array.from({ length: 30 }, (_, i) => i + 1)

    return (
        <div className="space-y-12 pb-24">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-rose-500/20">
                            <Heart className="w-8 h-8 text-white fill-white/20" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight">إحصائيات "خير"</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-gray-400 text-sm font-semibold">متابعة حية لنشاط المتسابقين</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
                    <SimpleStat label="إجمالي النقاط" value={totalPoints} sub="نقطة خير" color="amber" />
                    <SimpleStat label="الختمات" value={totalJuz} sub="أجزاء قرآن" color="emerald" />
                    <SimpleStat label="الأحاديث" value={totalHadith} sub="حديث شريف" color="rose" />
                    <SimpleStat label="معلق" value={pendingCount} sub="بانتظار التقييم" color="sky" highlight={pendingCount > 0} icon={<AlertCircle className="w-4 h-4" />} />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                {/* Sidebar Stats */}
                <div className="xl:col-span-1 space-y-8">
                    {/* Progress Overview Section */}
                    <div className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-sm">
                        <h3 className="flex items-center gap-2 font-black text-white text-lg">
                            <BarChart3 className="w-5 h-5 text-emerald-500" />
                            تفاعل اليوم {latestDay}
                        </h3>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>إتمام القرآن</span>
                                    <span>{Math.round(quranCompletionRate)}%</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${quranCompletionRate}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>إتمام الأحاديث</span>
                                    <span>{Math.round(hadithCompletionRate)}%</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${hadithCompletionRate}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <h3 className="text-lg font-black text-white">قائمة الأوائل</h3>
                        </div>

                        <div className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                            {leaderboard.map((user, idx) => (
                                <div key={user.id} className={cn(
                                    "p-6 flex items-center justify-between transition-all hover:bg-white/5",
                                    idx !== leaderboard.length - 1 && "border-b border-white/5",
                                    idx === 0 && "bg-amber-500/10"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm",
                                            idx === 0 ? "bg-amber-500 text-black shadow-xl shadow-amber-500/30" : "bg-gray-800 text-gray-400"
                                        )}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white truncate max-w-[100px]">{user.name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold mt-0.5">
                                                {user.juzCount} جزء • {user.hadithCount} حديث
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-amber-500 leading-none">{user.totalPoints}</p>
                                        <span className="text-[9px] text-gray-600 font-bold uppercase">نقاط</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Table */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-900 rounded-lg">
                                <Users className="w-5 h-5 text-sky-500" />
                            </div>
                            <h3 className="text-xl font-black text-white">متابعة الإنجاز اليومي</h3>
                        </div>
                        <div className="hidden sm:flex items-center gap-6">
                            <StatusLegend color="bg-emerald-500" label="قرآن" shadow="shadow-emerald-500/40" />
                            <StatusLegend color="bg-rose-500" label="حديث" shadow="shadow-rose-500/40" />
                            <StatusLegend color="bg-amber-500" label="خير" shadow="shadow-amber-500/40" />
                        </div>
                    </div>

                    <div className="bg-[#0A0A0E] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <table className="w-full text-right border-collapse min-w-[1400px]">
                                <thead>
                                    <tr className="bg-black/40">
                                        <th className="p-4 sm:p-8 text-center sticky right-0 bg-[#0A0A0E] z-30 w-[80px] sm:w-[160px] border-b border-white/5 shadow-2xl">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest hidden sm:block">المتسابق</span>
                                            <UserIcon className="w-4 h-4 text-gray-500 mx-auto sm:hidden" />
                                        </th>
                                        {days.map(d => (
                                            <th key={d} className="p-4 text-center min-w-[140px] border-b border-white/5 bg-white/[0.01]">
                                                <span className="text-[10px] text-gray-600 font-black block mb-1">يوم</span>
                                                <span className="text-xl font-black text-white">{d}</span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.02]">
                                    {players.map(player => (
                                        <tr key={player.id} className="group hover:bg-white/[0.03] transition-all">
                                            <td className="p-3 sm:p-6 sticky right-0 bg-[#0A0A0E]/95 backdrop-blur-md z-20 border-l border-white/5 w-[80px] sm:w-[160px] text-center shadow-lg">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] bg-gray-900 border border-white/10 flex items-center justify-center font-black text-sm sm:text-xl text-white group-hover:border-rose-500/50 transition-all duration-300 shadow-inner">
                                                        {player.displayName?.[0] || 'U'}
                                                    </div>
                                                    <span className="text-[9px] sm:text-sm text-white font-black truncate max-w-full leading-none">{player.displayName?.split(' ')[0] || 'لاعب'}</span>
                                                </div>
                                            </td>
                                            {days.map(dayNum => {
                                                const entry = player.khairEntries.find((e: any) => e.dayNumber === dayNum)

                                                return (
                                                    <td key={dayNum} className="p-5 border-x border-white/[0.01]">
                                                        <div className="flex flex-col gap-5 items-center">
                                                            {/* Activity Dots */}
                                                            <div className="flex gap-2 p-1.5 bg-black/40 rounded-full px-3">
                                                                <Dot active={entry?.completedJuz.length > 0} color="bg-emerald-500" />
                                                                <Dot active={entry?.completedHadith.length > 0} color="bg-rose-500" />
                                                                <Dot active={entry?.charityDeeds.length > 0} color={entry?.charityScore > 0 ? "bg-amber-500" : "bg-sky-500 animate-pulse"} />
                                                            </div>

                                                            {entry ? (
                                                                <div className="space-y-2.5 text-center">
                                                                    <KhairRatingInput
                                                                        userId={player.id}
                                                                        dayNumber={dayNum}
                                                                        playerName={player.displayName || 'لاعب'}
                                                                        deeds={entry.charityDeeds}
                                                                        initialScore={entry.charityScore}
                                                                    />
                                                                    <div className="px-2 py-0.5 bg-white/5 rounded-lg inline-block">
                                                                        <p className="text-[10px] font-black text-gray-500 tabular-nums leading-none">+{entry.points}</p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="w-12 h-12 flex items-center justify-center opacity-10">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SimpleStat({ label, value, sub, color, highlight, icon }: any) {
    const colorMap = {
        amber: "text-amber-500 bg-amber-500/5 border-amber-500/10",
        emerald: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
        rose: "text-rose-500 bg-rose-500/5 border-rose-500/10",
        sky: "text-sky-500 bg-sky-500/5 border-sky-500/10",
    }

    return (
        <div className={cn(
            "p-6 rounded-[2rem] border transition-all text-center space-y-1 backdrop-blur-sm relative overflow-hidden group",
            colorMap[color as keyof typeof colorMap],
            highlight && "ring-2 ring-sky-500 ring-offset-4 ring-offset-black border-sky-500/40"
        )}>
            {icon && (
                <div className="absolute top-2 right-2 opacity-20 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            )}
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 leading-none">{label}</p>
            <p className="text-3xl font-black tracking-tighter">{value}</p>
            <p className="text-[10px] font-black opacity-30 leading-none">{sub}</p>
        </div>
    )
}

function StatusLegend({ color, label, shadow }: any) {
    return (
        <div className="flex items-center gap-2">
            <div className={cn("w-2.5 h-2.5 rounded-full shadow-lg", color, shadow)} />
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{label}</span>
        </div>
    )
}

function Dot({ active, color }: { active: boolean, color: string }) {
    if (!active) return <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
    return <div className={cn("w-2.5 h-2.5 rounded-full", color)} />
}
