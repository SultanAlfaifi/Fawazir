import { verifySession } from '@/lib/session'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { Crown, Lock, CheckCircle, Trophy, Calendar, ArrowLeft, Star, Sparkles, Rocket, Ghost, ChevronLeft, Target, Gamepad2, ArrowRight, Map } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function CompetitionViewPage({ params }: { params: Promise<{ code: string }> }) {
    const session = await verifySession()
    const { code } = await params

    const competition = await prisma.competition.findUnique({
        where: { code },
        include: {
            days: {
                orderBy: { dayNumber: 'asc' },
                include: {
                    questions: {
                        include: {
                            submissions: { where: { userId: session.userId } }
                        }
                    }
                }
            },
            owner: { select: { displayName: true } }
        }
    })

    if (!competition) notFound()

    const participation = await prisma.participation.findUnique({
        where: {
            userId_competitionId: {
                userId: session.userId,
                competitionId: competition.id
            }
        }
    })

    if (!participation) {
        redirect('/app/competitions')
    }

    const totalDays = competition.days.length
    const completedDays = competition.days.filter(day => {
        const total = day.questions.length
        const solved = day.questions.filter(q => q.submissions.some(s => s.isCorrect)).length
        return total > 0 && solved === total
    }).length

    const progressPercentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0

    return (
        <div className="max-w-6xl mx-auto pb-44 px-4 sm:px-8" dir="rtl">

            {/* ── Top Navigation Bar ── */}
            <div className="flex items-center justify-between mb-12 pt-6">
                <Link
                    href="/app/competitions"
                    className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all text-sm font-black uppercase tracking-tight"
                >
                    <ArrowRight className="w-4 h-4" />
                    العودة للمسابقات
                </Link>

                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100/50">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest hidden sm:block">المشرف</span>
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                    <span className="text-xs font-black text-amber-900">{competition.owner.displayName}</span>
                </div>
            </div>

            {/* ── Cinematic Profile Dashboard ── */}
            <div className="relative mb-20">
                {/* Visual Background Elements */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full -z-10" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-500/5 blur-[100px] rounded-full -z-10" />

                <div className="bg-white border border-gray-100 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-14 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)] overflow-hidden">
                    {/* Header Layout */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="space-y-6 text-center lg:text-right flex-1">
                            <div className="inline-flex items-center gap-2 bg-gray-950 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-gray-950/20">
                                <Map className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                خريطة المغامرة
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-gray-950 tracking-tighter leading-[0.9] drop-shadow-sm">
                                {competition.title}
                            </h1>
                            <p className="text-gray-500 text-xl font-medium max-w-xl leading-relaxed mx-auto lg:mr-0 italic">
                                {competition.description || "استعد لخوض أروع التحديات الممتعة معنا!"}
                            </p>
                        </div>

                        {/* Stats Collection */}
                        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
                            <div className="bg-gray-50 p-6 rounded-[2.5rem] text-center border border-gray-100/50 group hover:bg-amber-500 transition-all duration-500">
                                <Trophy className="w-8 h-8 text-amber-500 group-hover:text-white mx-auto mb-3 transition-colors" />
                                <span className="block text-3xl font-black text-gray-950 group-hover:text-white transition-colors">{participation.totalScore}</span>
                                <span className="block text-[9px] font-black text-gray-400 group-hover:text-white/70 uppercase tracking-widest mt-1">مجموع النقاط</span>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-[2.5rem] text-center border border-gray-100/50 group hover:bg-indigo-600 transition-all duration-500">
                                <CheckCircle className="w-8 h-8 text-indigo-600 group-hover:text-white mx-auto mb-3 transition-colors" />
                                <span className="block text-3xl font-black text-gray-950 group-hover:text-white transition-colors">{completedDays}/{totalDays}</span>
                                <span className="block text-[9px] font-black text-gray-400 group-hover:text-white/70 uppercase tracking-widest mt-1">الأيام المكتملة</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Track */}
                    <div className="mt-14 pt-10 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">نسبة الإنجاز في المسابقة</span>
                            <span className="text-sm font-black text-indigo-600">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="h-4 bg-gray-50 rounded-full overflow-hidden relative p-1 shadow-inner border border-gray-100">
                            <div
                                className="h-full bg-gradient-to-l from-indigo-700 via-indigo-500 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Interactive Levels Road ── */}
            <div className="space-y-12">
                <div className="flex items-center gap-6 px-4">
                    <div className="w-12 h-12 bg-gray-950 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-gray-950/20">
                        <Gamepad2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-950 tracking-tight">مراحل التحدي</h3>
                    <div className="h-px flex-1 bg-gray-100 hidden md:block" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {competition.days.map((day) => {
                        const isLocked = !day.isManualOpen && (!day.unlockDate || new Date(day.unlockDate) > new Date());
                        const totalQuestions = day.questions.length;
                        const solvedQuestions = day.questions.filter(q => q.submissions.some(s => s.isCorrect)).length;
                        const isComplete = totalQuestions > 0 && solvedQuestions === totalQuestions;
                        const isActive = !isLocked && !isComplete;

                        return (
                            <Link
                                key={day.id}
                                href={isLocked ? '#' : `/app/day/${day.id}`}
                                className={cn(
                                    "group relative p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] transition-all duration-500 overflow-hidden border-2",
                                    isLocked
                                        ? "bg-gray-50/50 border-gray-200/40 opacity-50 grayscale cursor-not-allowed"
                                        : isComplete
                                            ? "bg-white border-emerald-100 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/5 shadow-sm"
                                            : "bg-white border-indigo-100/50 hover:border-indigo-600 hover:shadow-3xl hover:shadow-indigo-500/15 shadow-xl hover:-translate-y-2"
                                )}
                            >
                                {/* Active Glow Accent */}
                                {isActive && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-5 blur-3xl -z-10 group-hover:opacity-10 transition-opacity" />
                                )}

                                <div className="flex items-center gap-8 text-right">
                                    {/* Level Badge */}
                                    <div className={cn(
                                        "w-20 h-20 shrink-0 rounded-[2rem] flex items-center justify-center text-3xl font-black transition-all duration-700 group-hover:scale-110 group-hover:rotate-12",
                                        isLocked ? "bg-gray-100 text-gray-300" :
                                            isComplete ? "bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30" :
                                                "bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30"
                                    )}>
                                        {isLocked ? <Lock className="w-8 h-8" /> : isComplete ? <CheckCircle className="w-10 h-10" /> : day.dayNumber}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-2">
                                            {isActive && (
                                                <div className="flex h-2 w-2 relative">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                                                </div>
                                            )}
                                            <h4 className={cn(
                                                "text-2xl font-black tracking-tight",
                                                isLocked ? "text-gray-300" : "text-gray-950 group-hover:text-indigo-600 leading-tight"
                                            )}>
                                                {day.title}
                                            </h4>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 group-hover:bg-white transition-colors">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                                {solvedQuestions} من {totalQuestions} لغز متاح
                                            </div>
                                            {isComplete && (
                                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">تم حلها بنجاح</span>
                                            )}
                                        </div>
                                    </div>

                                    {!isLocked && (
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Tag Decoration */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-50" />
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* ── Journey Statistics Footer ── */}
            <div className="mt-40 text-center opacity-40 hover:opacity-100 hover:grayscale-0 grayscale transition-all duration-1000">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-1 bg-indigo-600 rounded-full" />
                    <div className="flex items-center gap-4 text-gray-500 uppercase tracking-[0.5em] font-black text-[10px]">
                        <Ghost className="w-5 h-5" />
                        نهاية مسار الرحلة الحالي
                    </div>
                </div>
            </div>
        </div>
    )
}
