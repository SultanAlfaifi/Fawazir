import { getDays } from '@/actions/days'
import { getKhairProgress } from '@/actions/khair'
import { verifySession } from '@/lib/session'
import { Heart, Lock, Star, CheckCircle2, BookOpen, Cloud, Sparkles, Sun, Leaf, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { KhairDayLink } from '@/components/khair/KhairDayLink'

export default async function KhairListPage() {
    await verifySession()
    const days = await getDays()
    const { entries } = await getKhairProgress()

    const totalPoints = entries.reduce((sum: number, e: any) => sum + e.points, 0)

    return (
        <div className="min-h-screen bg-[#F0F9FF] pb-32 overflow-hidden relative -mx-4 -mt-4 md:-mx-8 md:-mt-8">
            {/* Nature Atmosphere - Background Elements */}
            <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#BAE6FD] to-[#F0F9FF] z-0" />

            {/* Animated Clouds Background */}
            <div className="absolute top-20 left-[-10%] opacity-20 animate-pulse">
                <Cloud className="w-64 h-64 text-white" />
            </div>
            <div className="absolute top-40 right-[-5%] opacity-10">
                <Cloud className="w-96 h-96 text-white" />
            </div>

            <div className="relative z-10 space-y-10">
                {/* Header Area - Spring Morning Theme */}
                <div className="pt-12 px-6 text-center space-y-6">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full scale-110" />
                        <div className="relative w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border-4 border-white mx-auto transition-transform hover:scale-110 duration-500">
                            <Heart className="w-12 h-12 text-emerald-500 fill-emerald-500/10" strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-[#0C4A6E] tracking-tighter">واحة الخير</h1>
                        <p className="text-[#0369A1] text-lg font-bold max-w-sm mx-auto leading-relaxed">اغرس اليوم شتلةً، تجدها غداً ظلاً وارفاً بإذن الله</p>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="inline-flex items-center gap-8 bg-white/80 backdrop-blur-xl px-10 py-6 rounded-[3.5rem] border-2 border-white shadow-[0_20px_50px_rgba(186,230,253,0.5)]">
                        <div className="text-right">
                            <p className="text-[10px] text-[#0369A1] font-black uppercase tracking-[0.2em] mb-1">رصيد الصالحات</p>
                            <div className="flex items-center gap-3">
                                <span className="text-5xl font-black text-[#0C4A6E] tabular-nums">{totalPoints}</span>
                                <div className="p-2 bg-emerald-100 rounded-2xl">
                                    <Leaf className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 space-y-12 pb-12">
                    {/* Progress Grid */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-sm font-black text-[#0C4A6E] uppercase tracking-[0.3em]">خريطة الـ ٣٠ يوماً</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black text-gray-500">منجز</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-sky-200" />
                                    <span className="text-[10px] font-black text-gray-500">مفتوح</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3">
                            {days.map(day => {
                                const entry = entries.find((e: any) => e.dayNumber === day.dayNumber)
                                const isDone = !!entry && (entry.completedJuz.length > 0 || entry.completedHadith.length > 0 || entry.charityDeeds.length > 0)

                                return (
                                    <KhairDayLink
                                        key={day.dayNumber}
                                        dayNumber={day.dayNumber}
                                        isOpen={day.isOpen}
                                        isDone={isDone}
                                        points={entry?.points}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* Instruction Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KhairIncentiveCard
                            title="القرآن الكريم"
                            desc="ختم أجزاء من الكتاب الحكيم"
                            points="١٠٠ نقطة"
                            icon={<BookOpen className="w-8 h-8" />}
                            color="emerald"
                        />
                        <KhairIncentiveCard
                            title="الأربعين النووية"
                            desc="حفظ وقراءة الأحاديث الشريفة"
                            points="٥٠ نقطة"
                            icon={<Star className="w-8 h-8" />}
                            color="sky"
                        />
                        <KhairIncentiveCard
                            title="أعمال البر"
                            desc="سجل مبادراتك وخدماتك للآخرين"
                            points="تقييم متميز"
                            icon={<Sun className="w-8 h-8" />}
                            color="amber"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function KhairIncentiveCard({ title, desc, points, icon, color }: { title: string, desc: string, points: string, icon: any, color: string }) {
    const colorClasses: any = {
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-900 icon-bg-emerald-500",
        sky: "bg-sky-50 border-sky-100 text-sky-900 icon-bg-sky-500",
        amber: "bg-amber-50 border-amber-100 text-amber-900 icon-bg-amber-500"
    }
    return (
        <div className={cn("p-8 rounded-[2.5rem] border-2 space-y-4 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all", colorClasses[color])}>
            <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-2xl bg-white shadow-xl group-hover:scale-110 transition-transform", color === 'emerald' ? 'text-emerald-500' : color === 'sky' ? 'text-sky-500' : 'text-amber-500')}>
                    {icon}
                </div>
                <div className="bg-white/80 px-4 py-1.5 rounded-full text-xs font-black">
                    {points}
                </div>
            </div>
            <div className="space-y-1">
                <h4 className="text-xl font-black">{title}</h4>
                <p className="text-sm font-medium opacity-70 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
