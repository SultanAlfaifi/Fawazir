import { verifySession } from '@/lib/session'
import prisma from '@/lib/db'
import { ProfileForm } from './ProfileForm'
import { Trophy, Star, Activity, Target, Flame, Calendar, Award, ChevronLeft, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function MePage() {
    const session = await verifySession()

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
            joinedCompetitions: {
                include: {
                    competition: {
                        select: {
                            title: true,
                            code: true,
                            _count: { select: { days: true } }
                        }
                    }
                }
            },
            _count: {
                select: {
                    submissions: true
                }
            }
        }
    })

    if (!user) return <div>User not found</div>

    // Calculate some basic stats
    const totalScore = user.joinedCompetitions.reduce((acc, curr) => acc + curr.totalScore, 0)
    const activeCompetitions = user.joinedCompetitions.length

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4 sm:px-6" dir="rtl">

            {/* ── Modern Header Area ── */}
            <div className="relative mb-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -z-10" />

                <div className="pt-8 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-gray-900/10">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-950 tracking-tight">ملفي الشخصي</h1>
                    </div>
                </div>

                <ProfileForm user={user} />
            </div>

            {/* ── Stats Dashboard ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <StatCard
                    icon={Trophy}
                    label="إجمالي النقاط"
                    value={totalScore.toString()}
                    color="amber"
                />
                <StatCard
                    icon={Target}
                    label="المشاركات"
                    value={activeCompetitions.toString()}
                    color="indigo"
                />
                <StatCard
                    icon={Activity}
                    label="الحلول المقدمة"
                    value={user._count.submissions.toString()}
                    color="emerald"
                />
                <StatCard
                    icon={Flame}
                    label="المستوى الحالي"
                    value={totalScore > 100 ? 'ذهبي' : 'مشترك'}
                    color="rose"
                />
            </div>

            {/* ── Progression Section ── */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <Award className="w-7 h-7 text-amber-500" />
                        سجل الإنجازات
                    </h3>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">Progression Trace</span>
                </div>

                {user.joinedCompetitions.length === 0 ? (
                    <div className="relative group overflow-hidden bg-white border border-gray-100 rounded-[3rem] p-16 text-center border-dashed">
                        <div className="absolute inset-0 bg-gray-50/50 -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                        <h4 className="text-xl font-black text-gray-900 mb-2">رحلتك لم تبدأ بعد</h4>
                        <p className="text-gray-400 font-medium max-w-sm mx-auto mb-8">استكشف المسابقات المتاحة وابدأ في جمع النقاط وحل الألغاز الآن!</p>
                        <Link
                            href="/app/competitions"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                        >
                            استعراض المسابقات
                            <ChevronLeft className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {user.joinedCompetitions.map((participation) => (
                            <Link
                                href={`/app/competition/${participation.competition.code}`}
                                key={participation.id}
                                className="relative group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-2xl hover:border-amber-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-amber-500 transform -translate-x-full group-hover:translate-x-0 transition-transform" />

                                <div className="flex items-center gap-6 text-right w-full">
                                    <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center group-hover:bg-amber-50 transition-colors border border-gray-100 shrink-0">
                                        <Trophy className="w-8 h-8 text-gray-300 group-hover:text-amber-500 group-hover:scale-110 transition-all" />
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <h4 className="font-black text-gray-900 text-2xl group-hover:text-amber-600 transition-colors">{participation.competition.title}</h4>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full group-hover:bg-white transition-colors">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                <span>النقاط: {participation.totalScore}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full group-hover:bg-white transition-colors">
                                                <LayoutGrid className="w-3 h-3 text-indigo-500" />
                                                <span>الأيام: {participation.competition._count.days}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl text-sm font-black shadow-lg shadow-gray-900/10 group-hover:bg-amber-600 group-hover:shadow-amber-600/20 transition-all w-full sm:w-auto justify-center">
                                    <span>متابعة الرحلة</span>
                                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: 'amber' | 'indigo' | 'emerald' | 'rose' }) {
    const variants = {
        amber: 'bg-amber-50 text-amber-600 border-amber-100/50',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100/50',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
        rose: 'bg-rose-50 text-rose-600 border-rose-100/50'
    }

    const iconVariants = {
        amber: 'bg-amber-500 shadow-amber-500/20',
        indigo: 'bg-indigo-500 shadow-indigo-500/20',
        emerald: 'bg-emerald-500 shadow-emerald-500/20',
        rose: 'bg-rose-500 shadow-rose-500/20'
    }

    return (
        <div className={cn("relative overflow-hidden p-6 rounded-[2.25rem] border group transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50", variants[color])}>
            <div className="absolute top-0 left-0 w-full h-full bg-white/40 backdrop-blur-sm -z-10" />

            <div className="flex flex-col gap-4 text-right">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500", iconVariants[color])}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
                </div>
            </div>
        </div>
    )
}
