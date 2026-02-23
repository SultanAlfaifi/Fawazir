import { verifySession } from '@/lib/session'
import prisma from '@/lib/db'
import { JoinCompetitionForm } from './JoinCompetitionForm'
import { Trophy, Star, Target, Award, ChevronLeft, Rocket, PartyPopper, Sparkles, Layout } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function CompetitionsPage() {
    const session = await verifySession()

    const joinedCompetitions = await prisma.participation.findMany({
        where: { userId: session.userId },
        include: {
            competition: {
                include: {
                    owner: { select: { displayName: true } },
                    _count: { select: { participants: true, days: true } }
                }
            }
        },
        orderBy: { joinedAt: 'desc' }
    })

    const totalStars = joinedCompetitions.reduce((acc, curr) => acc + (curr.stars || 0), 0)

    return (
        <div className="max-w-5xl mx-auto pb-20 px-6 pt-10" dir="rtl">

            {/* ── Playful Header ── */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-20">
                <div className="space-y-4 text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-start gap-3 text-amber-500 font-black text-xs uppercase tracking-[0.2em]">
                        <Rocket className="w-5 h-5 animate-bounce" />
                        مستعد للمغامرة؟
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-950 tracking-tight">
                        مسابقاتي <span className="text-indigo-600">الرهيبة</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium max-w-sm mx-auto md:mr-0 leading-relaxed">
                        كل تحدي هو فرصة جديدة لتثبت ذكاءك وتجمع المزيد من النجوم! 🌟
                    </p>
                </div>

                <div className="flex flex-col items-center gap-4 bg-gray-50 p-6 rounded-[2.5rem] border-4 border-dashed border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">لديك رمز؟ انضم الآن!</p>
                    <JoinCompetitionForm />
                </div>
            </div>

            {/* ── Performance Quick Box ── */}
            <div className="grid grid-cols-2 gap-4 mb-20 max-w-md mx-auto md:mx-0">
                <div className="bg-amber-100/50 p-6 rounded-[2rem] border-2 border-amber-200/50 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Star className="w-6 h-6 fill-white" />
                    </div>
                    <span className="text-3xl font-black text-amber-700">{totalStars}</span>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">مجموع النجوم</span>
                </div>
                <div className="bg-indigo-100/50 p-6 rounded-[2rem] border-2 border-indigo-200/50 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-indigo-700">{joinedCompetitions.length}</span>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">تحديات نشطة</span>
                </div>
            </div>

            {/* ── The Cards ── */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                    <h3 className="text-2xl font-black text-gray-900">انطلق في الرحلة</h3>
                    <div className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                </div>

                {joinedCompetitions.length === 0 ? (
                    <div className="bg-white border-4 border-dashed border-gray-100 rounded-[3rem] p-16 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <PartyPopper className="w-12 h-12 text-gray-200" />
                        </div>
                        <h4 className="text-2xl font-black text-gray-950 mb-2">القائمة فارغة!</h4>
                        <p className="text-gray-400 font-medium">ابدأ الآن بإدخال رمز أول مسابقة لك في الأعلى.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {joinedCompetitions.map(({ competition, totalScore, stars }) => (
                            <Link
                                key={competition.id}
                                href={`/app/competition/${competition.code}`}
                                className="group bg-white border-2 border-gray-100 rounded-[2.5rem] p-6 pr-8 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
                            >
                                {/* Fun Corner Badge */}
                                <div className="absolute top-0 left-0 bg-indigo-50 px-4 py-2 rounded-br-2xl text-[10px] font-black text-indigo-600 uppercase tracking-widest border-r border-b border-indigo-100">
                                    {competition._count.participants} متسابق
                                </div>

                                <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-[2rem] flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                    <Trophy className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors" />
                                </div>

                                <div className="flex-1 text-center md:text-right space-y-2">
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                                        <Award className="w-3 h-3" />
                                        مشرف: {competition.owner.displayName}
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-950 group-hover:text-indigo-600 transition-colors">
                                        {competition.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-4 py-1.5 rounded-full text-xs font-black text-gray-500">
                                            <Sparkles className="w-3 h-3 text-amber-500" />
                                            {stars || 0} نجوم
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-4 py-1.5 rounded-full text-xs font-black text-gray-500">
                                            <Target className="w-3 h-3 text-indigo-500" />
                                            {totalScore} نقطة
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-4 py-1.5 rounded-full text-xs font-black text-gray-500">
                                            <Layout className="w-3 h-3 text-emerald-500" />
                                            {competition._count.days} أيام
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto">
                                    <div className="px-10 py-5 bg-gray-900 group-hover:bg-indigo-600 text-white rounded-[1.75rem] font-black text-sm transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-gray-900/10 group-hover:shadow-indigo-600/20">
                                        <span>افتح اللغز</span>
                                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
