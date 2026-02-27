import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { logoutAnalytics } from './action';
import { COOKIE_NAME } from './constants';
import Link from 'next/link';
import {
    Users, ShieldAlert, Swords, Hash, CheckCircle, XCircle,
    MessageCircle, Trophy, Activity, Target, BrainCircuit, Users2,
    CalendarDays, Star, Award, Heart, ShieldQuestion
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'مركز القيادة | فوازير',
    description: 'إحصائيات متقدمة لمنصة فوازير'
};

export const revalidate = 0; // Always fresh data

export default async function AnalyticsPage() {
    const cookieStore = await cookies();
    const isAuth = cookieStore.get(COOKIE_NAME)?.value === 'authenticated';

    if (!isAuth) {
        return redirect('/login');
    }

    // Fetching data sequentially or in small batches to prevent Neon DB connection exhaustion
    const totalUsers = await prisma.user.count();
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    const playerCount = await prisma.user.count({ where: { role: 'PLAYER' } });

    const competitionsCount = await prisma.competition.count();
    const participationsCount = await prisma.participation.count();
    const participationAggregate = await prisma.participation.aggregate({ _sum: { totalScore: true, stars: true } });

    const submissionsCount = await prisma.submission.count();
    const correctSubmissions = await prisma.submission.count({ where: { isCorrect: true } });

    const teamsCount = await prisma.team.count();
    const chatMessagesCount = await prisma.chatMessage.count();

    const tasksCount = await prisma.task.count();
    const completedTasks = await prisma.task.count({ where: { status: 'DONE' } });

    const khairEntriesCount = await prisma.khairEntry.count();
    const khairAggregate = await prisma.khairEntry.aggregate({ _sum: { points: true, charityScore: true } });

    const questionsCount = await prisma.question.count();
    const daysCount = await prisma.day.count();
    const openDaysCount = await prisma.day.count({ where: { isManualOpen: true } });

    const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { displayName: true, role: true, createdAt: true, email: true }
    });

    const topPlayers = await prisma.participation.findMany({
        orderBy: [{ totalScore: 'desc' }, { stars: 'desc' }],
        take: 5,
        include: { user: { select: { displayName: true } }, competition: { select: { title: true } } }
    });

    const incorrectSubmissions = submissionsCount - correctSubmissions;
    const accuracyRate = submissionsCount > 0 ? Math.round((correctSubmissions / submissionsCount) * 100) : 0;
    const taskCompletionRate = tasksCount > 0 ? Math.round((completedTasks / tasksCount) * 100) : 0;
    const totalKhairPoints = (khairAggregate._sum.points || 0) + (khairAggregate._sum.charityScore || 0);
    const totalEcoStars = participationAggregate._sum.stars || 0;
    const totalEcoScore = participationAggregate._sum.totalScore || 0;

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-blue-500/30 font-sans" dir="rtl">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent pointer-events-none blur-3xl" />

            <header className="relative z-10 border-b border-white/5 bg-gray-900/40 backdrop-blur-xl supports-backdrop-blur:bg-gray-900/20 sticky top-0">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center shadow-inner shadow-blue-500/20">
                            <Activity className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight">مركز القيادة <span className="text-blue-500">العالي</span></h1>
                            <p className="text-xs text-gray-500 font-medium tracking-wide">التحليل الشامل لمنصة فوازير</p>
                        </div>
                    </div>

                    <form action={logoutAnalytics}>
                        <button type="submit" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/20 active:scale-95">
                            إنهاء الجلسة
                        </button>
                    </form>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-10">
                {/* 1. Overview Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                    <Link href="/analytics/users">
                        <Card title="إجمالي المستخدمين (انقر للإدارة)" value={totalUsers} icon={Users} color="blue" description={`${playerCount} لاعب | ${adminCount} مشرف`} />
                    </Link>
                    <Card title="الإجابات المرسلة" value={submissionsCount} icon={BrainCircuit} color="purple" description={`دقة الإجابات: %${accuracyRate}`} />
                    <Card title="إجمالي النجوم المتداولة" value={totalEcoStars} icon={Star} color="amber" description={`${totalEcoScore} نقطة تم حصدها`} />
                    <Card title="تفاعلات زاد الخير" value={khairEntriesCount} icon={Heart} color="emerald" description={`${totalKhairPoints} نقطة خير`} />
                </div>

                {/* Content & Logistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
                    <Card title="المسابقات النشطة" value={competitionsCount} icon={Trophy} color="indigo" description={`${participationsCount} حالة تسجيل للمنافسة`} />
                    <Card title="حجم المحتوى (الأسئلة)" value={questionsCount} icon={ShieldQuestion} color="rose" description={`بنك أسئلة متنامي`} />
                    <Card title="الأيام والرحلات" value={daysCount} icon={CalendarDays} color="teal" description={`${openDaysCount} يوم مفتوح حالياً`} />
                </div>

                {/* 2. Deep Dive Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">

                    {/* Insights Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-900/40 border border-white/5 rounded-[2rem] p-8 shadow-2xl backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                                        <Hash className="w-5 h-5 text-purple-400" />
                                        <span>تحليل الأداء الفكري</span>
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-400 font-bold">الإجابات الصحيحة</span>
                                                <span className="text-emerald-400 font-black">{correctSubmissions}</span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-950 rounded-full overflow-hidden border border-white/5">
                                                <div className="h-full bg-gradient-to-l from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${accuracyRate}%` }} />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-400 font-bold">الإجابات الخاطئة</span>
                                                <span className="text-rose-400 font-black">{incorrectSubmissions}</span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-950 rounded-full overflow-hidden border border-white/5">
                                                <div className="h-full bg-gradient-to-l from-rose-400 to-rose-600 rounded-full" style={{ width: `${100 - accuracyRate}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-px bg-white/5 hidden md:block" />

                                <div className="flex-1 space-y-6">
                                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                                        <Target className="w-5 h-5 text-sky-400" />
                                        <span>إنجاز المهام اليومية</span>
                                    </h3>

                                    <div className="flex items-center gap-6">
                                        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle cx="48" cy="48" r="40" className="stroke-gray-800 fill-none" strokeWidth="12" />
                                                <circle cx="48" cy="48" r="40" className="stroke-sky-500 fill-none transition-all duration-1000" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * taskCompletionRate) / 100} strokeLinecap="round" />
                                            </svg>
                                            <span className="absolute text-xl font-black text-white">%{taskCompletionRate}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-400 font-medium"><span className="text-white font-bold">{completedTasks}</span> مهمة منجزة</p>
                                            <p className="text-sm text-gray-400 font-medium"><span className="text-gray-300 font-bold">{tasksCount - completedTasks}</span> مهمة معلقة</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Activity */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-900/40 border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                    <Users2 className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-white">{teamsCount}</p>
                                    <p className="text-sm text-gray-400 font-medium">الفرق المُشكّلة</p>
                                </div>
                            </div>
                            <div className="bg-gray-900/40 border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                                    <MessageCircle className="w-6 h-6 text-teal-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-white">{chatMessagesCount}</p>
                                    <p className="text-sm text-gray-400 font-medium">رسالة متبادلة</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Lists */}
                    <div className="space-y-6">
                        {/* Top Players Leaderboard */}
                        <div className="bg-gradient-to-b from-gray-900/60 to-gray-900/20 border border-white/5 rounded-[2rem] p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
                            <h3 className="text-lg font-black text-white flex items-center gap-2 mb-6">
                                <Award className="w-5 h-5 text-amber-400" />
                                <span>نخبة الأبطال (Top 5)</span>
                            </h3>
                            <div className="space-y-3">
                                {topPlayers.map((tp, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-950/40 border border-white/5 relative overflow-hidden transition-all hover:border-amber-500/30 hover:bg-gray-900/60">
                                        <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center shrink-0 font-black text-xs text-gray-400">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-100 text-sm truncate">{tp.user?.displayName || 'بدون اسم'}</p>
                                            <p className="text-[10px] text-amber-500/80 font-bold truncate">{tp.competition?.title}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0 bg-amber-500/10 px-2 py-1 rounded-lg">
                                            <span className="font-black text-amber-400 text-sm">{tp.totalScore}</span>
                                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        </div>
                                    </div>
                                ))}
                                {topPlayers.length === 0 && (
                                    <p className="text-center text-sm text-gray-500 py-4">لم يتم حصد أي نقاط بعد</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Users List */}
                        <div className="bg-gradient-to-b from-gray-900/60 to-gray-900/20 border border-white/5 rounded-[2rem] p-6 shadow-2xl backdrop-blur-sm">
                            <h3 className="text-lg font-black text-white flex items-center gap-2 mb-6">
                                <Users className="w-5 h-5 text-blue-400" />
                                <span>أحدث المنضمين</span>
                            </h3>
                            <div className="space-y-3">
                                {recentUsers.map((user, idx) => (
                                    <div key={idx} className="flex flex-col gap-1 p-3 rounded-2xl bg-gray-950/50 border border-white/5 hover:border-blue-500/30 transition-all group">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-gray-100 group-hover:text-white transition-colors text-sm">
                                                {user.displayName || 'بدون اسم'}
                                            </p>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase ${user.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-medium truncate" dir="ltr">{user.email}</p>
                                    </div>
                                ))}
                                {recentUsers.length === 0 && (
                                    <p className="text-center text-sm text-gray-500 py-4">لا يوجد مستخدمين بعد</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

// Reusable Card Component
function Card({ title, value, icon: Icon, color, description }: any) {
    const colorMap: Record<string, string> = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/10',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/10',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/10',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10',
        teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20 shadow-teal-500/10',
    };

    const iconClasses = colorMap[color];

    return (
        <div className="bg-gray-900/40 border border-white/5 rounded-[2rem] p-6 shadow-2xl hover:bg-gray-900/60 transition-colors backdrop-blur-sm relative overflow-hidden group">
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] transition-all group-hover:blur-[60px] opacity-20 ${iconClasses.split(' ')[0].replace('text-', 'bg-')}`} />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${iconClasses}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                <h4 className="text-3xl font-black text-white tracking-tight mb-2">{value}</h4>
                <p className="text-sm font-bold text-gray-400 mb-1">{title}</p>
                <p className="text-xs font-medium text-gray-600">{description}</p>
            </div>
        </div>
    );
}
