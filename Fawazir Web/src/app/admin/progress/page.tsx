import { getLeaderboard } from '@/actions/progress'
import { getDays } from '@/actions/days'
import prisma from '@/lib/db'
import { Crown, Zap, CheckCircle, BarChart, Star, TrendingUp, Search, Filter, ShieldCheck, User as UserIcon } from 'lucide-react'
import { RatingInput } from '@/components/admin/RatingInput'
import { cn } from '@/lib/utils'

async function getUserTaskStatus(userId: string) {
    const tasks = await prisma.task.findMany({
        where: { userId },
        select: { id: true, dayId: true, status: true, title: true }
    })
    return tasks
}

async function getAllEvaluations() {
    return await prisma.dailyEvaluation.findMany()
}

export default async function AdminProgressPage() {
    const leaderboard = await getLeaderboard()
    const days = await getDays()
    const allEvaluations = await getAllEvaluations()

    // Prepare data for the matrix view
    const usersWithUnlockData = await Promise.all(leaderboard.map(async (user: any) => {
        const allTasks = await getUserTaskStatus(user.id)
        const daysStatus = days.map((day: any) => {
            const dayTasks = allTasks.filter((t: any) => t.dayId === day.id)
            const evaluation = allEvaluations.find((e: any) => e.userId === user.id && e.dayId === day.id)
            const total = dayTasks.length
            const completed = dayTasks.filter((t: any) => t.status === 'DONE').length

            let statusString = 'EMPTY'
            if (total > 0) {
                statusString = completed === total ? 'FULL' : completed > 0 ? 'PARTIAL' : 'PENDING'
            }
            return {
                dayId: day.id,
                dayNumber: day.dayNumber,
                status: statusString,
                total,
                completed,
                score: evaluation?.score || 0
            }
        })

        const totalPerformance = daysStatus.reduce((acc: number, d: any) => acc + d.score, 0)

        return {
            ...user,
            daysStatus,
            totalPerformance,
            totalAssigned: allTasks.length,
            completionRate: allTasks.length > 0 ? Math.round((user.score / allTasks.length) * 100) : 0
        }
    }))

    return (
        <div className="space-y-12 pb-24">
            {/* Professional Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">تحليل الأداء الحي</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">مصفوفة الإنجاز</h1>
                    <p className="text-gray-400 font-medium max-w-lg">رؤية كاملة لمستوى التزام وتقييم المتسابقين عبر جميع أيام التحدي الـ ٣٠.</p>
                </div>

                <div className="flex items-center gap-4 bg-[#0A0A0B] p-2 rounded-2xl border border-white/5">
                    <div className="flex -space-x-3">
                        {usersWithUnlockData.slice(0, 5).map((u: any, i: number) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0B] bg-gray-800 flex items-center justify-center font-black text-[10px] text-gray-400 uppercase">
                                {u.name[0]}
                            </div>
                        ))}
                    </div>
                    <div className="px-4">
                        <p className="text-xs font-black text-white">{usersWithUnlockData.length} لاعب</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">تحديث مباشر</p>
                    </div>
                </div>
            </div>

            {/* Matrix View */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <BarChart className="w-5 h-5 text-gray-500" />
                        <h2 className="text-xl font-black text-white">جدول النقاط والتقييم</h2>
                    </div>

                    <div className="hidden lg:flex items-center gap-6">
                        <Legend color="bg-emerald-500" label="مكتمل" />
                        <Legend color="bg-amber-500" label="جزئي" />
                        <Legend color="bg-rose-500" label="لم يبدأ" />
                        <Legend color="bg-white/10" label="لا يوجد" />
                    </div>
                </div>

                <div className="bg-[#0A0A0E] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <table className="w-full text-right border-collapse min-w-[1500px]">
                            <thead>
                                <tr className="bg-black/40">
                                    <th className="p-4 sm:p-8 text-center sticky right-0 bg-[#0A0A0E] z-30 w-[80px] sm:w-[180px] border-b border-white/5 shadow-2xl">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest hidden sm:block">المتسابق</span>
                                        <UserIcon className="w-4 h-4 text-gray-500 mx-auto sm:hidden" />
                                    </th>
                                    {days.map((d: any) => (
                                        <th key={d.id} className="p-4 text-center min-w-[100px] border-b border-white/5 bg-white/[0.01]">
                                            <span className="text-[10px] text-gray-600 font-black block mb-1">يوم</span>
                                            <span className="text-xl font-black text-white">{d.dayNumber}</span>
                                        </th>
                                    ))}
                                    <th className="p-4 text-center min-w-[120px] border-b border-white/5 bg-amber-500/5">
                                        <span className="text-[10px] text-amber-500/50 font-black block mb-1">المجموع</span>
                                        <Star className="w-4 h-4 text-amber-500 mx-auto" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {usersWithUnlockData.map((user: any, uIdx: number) => (
                                    <tr key={user.id} className="group hover:bg-white/[0.03] transition-all">
                                        <td className="p-3 sm:p-6 sticky right-0 bg-[#0A0A0E]/95 backdrop-blur-md z-20 border-l border-white/5 w-[80px] sm:w-[180px] text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="relative">
                                                    <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] bg-gray-900 border border-white/10 flex items-center justify-center font-black text-sm sm:text-2xl text-white group-hover:border-amber-500/50 transition-all duration-300 shadow-inner">
                                                        {user.name[0]}
                                                    </div>
                                                    {uIdx < 3 && (
                                                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-[#0A0A0E] flex items-center justify-center p-0.5 sm:p-1 border border-white/5">
                                                            <Crown className={cn("w-3 h-3 sm:w-5 sm:h-5", uIdx === 0 ? "text-amber-500" : uIdx === 1 ? "text-gray-400" : "text-orange-500")} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[9px] sm:text-sm text-white font-black truncate max-w-[70px] sm:max-w-[140px] mb-0.5">{user.name.split(' ')[0]}</p>
                                                    <p className="text-[7px] sm:text-[10px] text-gray-600 font-black uppercase tracking-tighter hidden sm:block">{user.theme.label}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {user.daysStatus.map((d: any) => {
                                            let statusColor = 'bg-white/5'
                                            if (d.status === 'FULL') statusColor = 'bg-emerald-500'
                                            else if (d.status === 'PARTIAL') statusColor = 'bg-amber-500 animate-pulse'
                                            else if (d.status === 'PENDING') statusColor = 'bg-rose-500'

                                            return (
                                                <td key={d.dayNumber} className="p-4 border-x border-white/[0.01] text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5">
                                                            <div className={cn("w-2 h-2 rounded-full", statusColor)} />
                                                            <span className="text-[10px] font-black text-gray-500 tabular-nums">{d.status !== 'EMPTY' ? `${d.completed}/${d.total}` : '-'}</span>
                                                        </div>

                                                        {d.dayId && (
                                                            <div className="scale-90 opacity-80 group-hover:opacity-100 transition-all">
                                                                <RatingInput
                                                                    userId={user.id}
                                                                    dayId={d.dayId}
                                                                    initialScore={d.score}
                                                                    playerName={user.name}
                                                                    dayNumber={d.dayNumber}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            )
                                        })}
                                        <td className="p-4 bg-amber-500/[0.02] text-center border-l border-amber-500/10">
                                            <div className="space-y-1">
                                                <p className="text-2xl font-black text-amber-500 tabular-nums">{user.totalPerformance}</p>
                                                <p className="text-[9px] font-black text-amber-500/40 uppercase tracking-widest">مجموع النقاط</p>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-[2.5rem] p-8 flex items-center gap-8">
                <div className="w-16 h-16 rounded-[2rem] bg-amber-500 flex items-center justify-center shadow-2xl shadow-amber-500/30 shrink-0">
                    <ShieldCheck className="w-8 h-8 text-black" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-white font-black text-xl leading-none">إرشاد المشرف</h4>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                        كمؤشر للأداء، تعتمد هذه المصفوفة على "التقييم اليومي" الذي تمنحه لكل لاعب بناءً على جودة إنجازه للمهام. تأكد من مراجعة المهام قبل اعتماد الدرجة النهائية لضمان العدالة وتشجيع التميز بين المتسابقين.
                    </p>
                </div>
            </div>
        </div>
    )
}

function Legend({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className={cn("w-2 h-2 rounded-full shadow-lg", color)} style={{ boxShadow: `0 0 10px ${color.replace('bg-', '')}` }} />
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{label}</span>
        </div>
    )
}
