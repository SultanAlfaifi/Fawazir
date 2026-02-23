import { getDayDetails, getMyTeam } from '@/actions/days'
import { notFound } from 'next/navigation'
import { Zap, BookOpen, Star, ArrowRight, Target, Users, LayoutGrid, Calendar, ChevronLeft, Sparkles, Trophy, Gamepad2, MessageCircle, ClipboardCheck, ArrowLeft, Ghost, Flame, Rocket, Compass, CheckCircle2, ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { TeamChat } from '@/components/TeamChat'
import { DayMissions } from '@/components/DayMissions'
import Link from 'next/link'
import { verifySession } from '@/lib/session'
import { cn } from '@/lib/utils'

interface DayTask {
    title: string
    url: string
    points: number
}

function parseTasks(tasksJson: string): DayTask[] {
    try {
        const parsed = JSON.parse(tasksJson)
        if (Array.isArray(parsed)) return parsed
    } catch {
        // ignore parse errors
    }
    return []
}

export default async function DayPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await verifySession()
    const { id } = await params

    const day = await getDayDetails(id)
    if (!day) return notFound()

    const myTeam = await getMyTeam(id)
    const adminTasks: DayTask[] = parseTasks((day as any).tasksJson ?? '[]')

    const mergedMissions = adminTasks.map(at => {
        const dbRecord = day.tasks.find((t: any) => t.title === at.title && !t.isBonus)
        return {
            title: at.title,
            url: at.url,
            points: at.points || 0,
            id: dbRecord?.id || null,
            status: dbRecord?.status || 'TODO'
        }
    })

    const competitionCode = (day as any).competition?.code

    return (
        <div className="min-h-screen bg-white relative overflow-x-hidden pt-4 pb-32" dir="rtl">
            {/* Background is now solid white as requested */}

            {/* ── Precision Navigation ── */}
            <nav className="max-w-7xl mx-auto px-6 mb-12 flex items-center justify-between">
                <Link
                    href={`/app/competition/${competitionCode}`}
                    className="group flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>العودة للمركز</span>
                </Link>

                <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex -space-x-1 rtl:space-x-reverse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={cn("w-1.5 h-1.5 rounded-full ring-2 ring-white", i <= day.dayNumber ? "bg-amber-400" : "bg-gray-200")} />
                        ))}
                    </div>
                    <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest leading-none">المستوى {day.dayNumber}</span>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6">
                {/* ── Premium Editorial Header ── */}
                <header className="mb-24 text-center relative">
                    <div className="inline-flex items-center gap-2.5 px-6 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100/50 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        تحدي اليوم
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black text-gray-950 tracking-tighter mb-8 leading-[0.9]">
                        {day.title}
                    </h1>

                    {day.challengeTitle && (
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative flex items-center gap-6 bg-white border border-gray-100 px-8 py-5 rounded-3xl shadow-xl shadow-gray-200/40">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Rocket className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1.5">المهمة الأساسية</p>
                                    <span className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight">{day.challengeTitle}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* ── Left Side: Editorial Content ── */}
                    <main className="lg:col-span-8 space-y-16">

                        {/* Story Section */}
                        {day.content && (
                            <section className="bg-white border border-gray-100 rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.03)] relative overflow-hidden">
                                <div className="space-y-12">
                                    <div className="flex items-center gap-3 text-indigo-600">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <span className="text-[12px] font-black uppercase tracking-widest">قصة اليوم</span>
                                    </div>
                                    <div className="prose prose-lg md:prose-xl prose-indigo max-w-none text-right 
                                        prose-p:leading-[1.9] prose-p:text-gray-600 prose-p:font-medium
                                        prose-strong:text-indigo-950 prose-strong:font-black
                                        prose-headings:font-black prose-h1:text-4xl prose-h1:tracking-tighter 
                                        prose-blockquote:border-r-4 prose-blockquote:border-indigo-100 prose-blockquote:bg-indigo-50/20 prose-blockquote:rounded-2xl prose-blockquote:py-8">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{day.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Challenge Section */}
                        {day.challengeContent && (
                            <section className="relative">
                                <div className="bg-white border-2 border-indigo-50 rounded-[3rem] p-8 md:p-16 shadow-[0_30px_70px_-20px_rgba(79,70,229,0.05)] relative overflow-hidden">
                                    <div className="relative z-10 space-y-12">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-gray-50">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                                    <Target className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-black text-gray-950 tracking-tight">تفاصيل التحدي</h3>
                                                    <p className="text-[11px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1">Challenge Details</p>
                                                </div>
                                            </div>

                                            <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                                <span className="text-emerald-700 text-[10px] font-black">الحالة: نشط حالياً</span>
                                            </div>
                                        </div>

                                        <div className="prose prose-lg md:prose-xl prose-indigo max-w-none text-right 
                                            prose-p:text-gray-600 prose-p:leading-relaxed
                                            prose-strong:text-indigo-900 prose-strong:font-black
                                            prose-ul:list-disc prose-li:marker:text-indigo-500
                                            prose-blockquote:border-r-8 prose-blockquote:border-indigo-600 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-8 prose-blockquote:rounded-2xl">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{day.challengeContent}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </main>

                    {/* ── Right Side: Operation Panel ── */}
                    <aside className="lg:col-span-4 space-y-12 sticky top-10">

                        {/* Status Card */}
                        <div className="bg-white rounded-[3rem] p-6 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
                            <div className="flex flex-col items-center text-center gap-5 mb-10">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                    <ClipboardCheck className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-gray-950 tracking-tight">المهام المطلوبة</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Mission List</p>
                                </div>
                            </div>

                            <div className="w-full">
                                <DayMissions missions={mergedMissions} dayId={id} />
                            </div>
                        </div>

                        {/* Team & Chat Card */}
                        <div className="bg-white rounded-[3rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden group">
                            <div className="space-y-10 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-gray-100">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-gray-950 tracking-tight leading-none">دردشة الفريق</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Team Chat</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[8px] font-black text-emerald-600 uppercase">Live</span>
                                    </div>
                                </div>

                                {myTeam ? (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-3xl border border-gray-100">
                                            <div className="w-12 h-12 bg-white text-indigo-600 rounded-xl flex items-center justify-center font-black text-xl border border-gray-100">
                                                {myTeam.name[0]}
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="font-black text-gray-950 text-sm leading-none">{myTeam.name}</h5>
                                                <p className="text-[9px] font-bold text-indigo-500/60 uppercase tracking-widest mt-1">الفريق النشط</p>
                                            </div>
                                        </div>

                                        <div className="w-full bg-gray-50/50 rounded-2xl p-1 border border-gray-100">
                                            <TeamChat
                                                teamId={myTeam.id}
                                                currentUserId={session.userId}
                                                teammateName={myTeam.members[0]?.displayName || 'الزميل'}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-20 text-center space-y-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                                            <Ghost className="w-10 h-10 text-gray-200" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">لا يوجد فريق نشط حالياً</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </aside>
                </div>
            </div >
        </div >
    )
}
