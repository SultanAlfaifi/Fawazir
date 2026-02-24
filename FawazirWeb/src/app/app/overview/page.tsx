import { getDays, getMyTeam } from '@/actions/days'
import { getLeaderboard } from '@/actions/progress'
import { DayCard } from '@/components/DayCard'
import { CountdownTimer } from '@/components/CountdownTimer'
import { TeamChat } from '@/components/TeamChat'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/db'
import { Crown, Star, Heart, Trophy, Calendar, Sparkles, Target, Zap, Activity, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHARACTER_THEMES, CharacterType } from '@/lib/theme'

async function getMyDayStatus(userId: string) {
    const completedTasks = await prisma.task.findMany({
        where: { userId, status: 'DONE' },
        select: { dayId: true }
    })
    const completedDayIds = new Set(completedTasks.map(t => t.dayId).filter(Boolean))
    return completedDayIds
}

const THEME_CLASSES: Record<string, { bg: string, border: string, hover: string, text: string, shadow: string }> = {
    emerald: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        hover: 'hover:border-emerald-500/50',
        text: 'text-emerald-400',
        shadow: 'shadow-emerald-500/20'
    },
    blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        hover: 'hover:border-blue-500/50',
        text: 'text-blue-400',
        shadow: 'shadow-blue-500/20'
    },
    orange: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        hover: 'hover:border-orange-500/50',
        text: 'text-orange-400',
        shadow: 'shadow-orange-500/20'
    },
    red: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        hover: 'hover:border-red-500/50',
        text: 'text-red-400',
        shadow: 'shadow-red-500/20'
    }
}

export default async function OverviewPage() {
    const session = await verifySession()
    const days = await getDays()
    const leaderboard = await getLeaderboard()
    const completedDayIds = await getMyDayStatus(session.userId)

    const activeDay = days.find((d: any) => d.isOpen)
    const myTeam: any = activeDay ? await getMyTeam(activeDay.id) : null
    const teammate = myTeam?.members[0]
    const teammateTheme = teammate ? CHARACTER_THEMES[teammate.avatar as CharacterType] || CHARACTER_THEMES.NAJM : null
    const themeStyles = teammateTheme ? THEME_CLASSES[teammateTheme.color] : null

    const myEvaluations = await prisma.dailyEvaluation.findMany({
        where: { userId: session.userId }
    })

    const myTotalPerformance = myEvaluations.reduce((acc, e) => acc + (e.score || 0), 0)

    const myKhairEntries = await prisma.khairEntry.findMany({
        where: { userId: session.userId }
    })
    const myKhairPoints = myKhairEntries.reduce((acc, e) => acc + (e.points || 0), 0)

    const now = new Date()
    const upcomingDay = days.find((d: any) => new Date(d.openDateString) > now && !d.isOpen)

    const myRankIndex = leaderboard.findIndex(u => u.id === session.userId)
    const myRank = myRankIndex !== -1 ? myRankIndex + 1 : '-'

    return (
        <div className="space-y-12 pb-32 max-w-6xl mx-auto">

            {/* NEW Premium Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                <div className="text-center md:text-right space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        مرحباً، <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">{session.displayName}</span> 👋
                    </h1>
                    <p className="text-gray-500 font-bold text-lg">مغامرة الفوز مستمرة.. أرِنا مهاراتك!</p>
                </div>

                {/* Stats Hub */}
                <div className="flex flex-wrap justify-center md:justify-end gap-3">
                    <HeaderStat
                        icon={<Crown className="w-5 h-5 text-amber-500" />}
                        label="المركز"
                        value={myRank}
                        color="amber"
                    />
                    <HeaderStat
                        icon={<Star className="w-5 h-5 text-emerald-500 fill-emerald-500" />}
                        label="الفوز"
                        value={myTotalPerformance}
                        color="emerald"
                    />
                    <HeaderStat
                        icon={<Heart className="w-5 h-5 text-rose-500 fill-rose-500" />}
                        label="الخير"
                        value={myKhairPoints}
                        color="rose"
                    />
                </div>
            </div>

            {/* Teammate Section - Sticky/Priority */}
            {myTeam && teammateTheme && themeStyles && (
                <div className={cn(
                    "relative group overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl transition-all animate-in slide-in-from-top duration-700",
                    themeStyles.bg,
                    themeStyles.border,
                    themeStyles.hover
                )}>
                    <div className="absolute top-0 right-0 p-6 opacity-5 select-none pointer-events-none">
                        <Users className={cn("w-48 h-48", themeStyles.text)} />
                    </div>

                    <div className="relative z-10 space-y-4 text-center md:text-right">
                        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border", themeStyles.bg, themeStyles.border)}>
                            <Zap className={cn("w-3.5 h-3.5 fill-current", themeStyles.text)} />
                            <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", themeStyles.text)}>تحدي الفريق نشط الآن</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                معك البطل <span className={cn("text-transparent bg-clip-text bg-gradient-to-r",
                                    teammateTheme.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                                        teammateTheme.color === 'blue' ? 'from-blue-400 to-blue-600' :
                                            teammateTheme.color === 'orange' ? 'from-orange-400 to-orange-600' :
                                                'from-red-400 to-red-600'
                                )}>{teammate.displayName || 'مجهول'}</span>
                            </h2>
                            <p className="text-gray-400 font-bold text-lg max-w-md">تعاونوا معاً في تحدي اليوم، حلوا الألغاز، واكسبوا النقاط سوياً. القوة في الجماعة!</p>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <TeamChat
                            teamId={myTeam.id}
                            currentUserId={session.userId}
                            teammateName={teammate.displayName || 'زميلك'}
                        />
                        <div className="flex -space-x-3 rtl:space-x-reverse">
                            <div className="w-10 h-10 rounded-full border-2 border-[#0A0A0E] bg-gray-800 flex items-center justify-center text-[10px] font-black text-white shadow-lg">أنت</div>
                            <div className={cn("w-10 h-10 rounded-full border-2 border-[#0A0A0E] flex items-center justify-center text-[10px] font-black text-white shadow-lg",
                                teammateTheme.color === 'emerald' ? 'bg-emerald-500' :
                                    teammateTheme.color === 'blue' ? 'bg-blue-500' :
                                        teammateTheme.color === 'orange' ? 'bg-orange-500' :
                                            'bg-red-500'
                            )}>
                                <teammateTheme.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Countdown Card */}
            <div className="relative group overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-[#0A0A0E] border-2 border-white/5 p-8 md:p-16 flex flex-col items-center text-center shadow-2xl transition-all hover:border-white/10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5 pointer-events-none" />
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />

                <div className="relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <Target className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">التحدي القادم</span>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                            {upcomingDay ? `اليوم ${upcomingDay.dayNumber} يفتح قريباً` : 'جميع التحديات مفتوحة!'}
                        </h2>
                        {upcomingDay && (
                            <div className="flex justify-center scale-110 md:scale-125 pt-4">
                                <CountdownTimer targetDate={upcomingDay.openDateString} />
                            </div>
                        )}
                        {!upcomingDay && (
                            <div className="flex items-center justify-center gap-3 text-emerald-500 font-black text-2xl animate-pulse">
                                <Trophy className="w-8 h-8" />
                                <span>أنت مستعد للقمة!</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hall of Fame - Horizontal Scrolling Leaders */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-amber-500" />
                        قائمة الأبطال
                    </h3>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">تحديث مباشر</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {leaderboard.slice(0, 4).map((user, idx) => (
                        <LeaderCard
                            key={user.id}
                            user={user}
                            isMe={user.id === session.userId}
                            rank={idx + 1}
                            daysCount={days.length}
                        />
                    ))}
                </div>
            </section>

            {/* Challenge Map - The 30 Days Grid */}
            <section className="space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                    <div className="space-y-1 text-center md:text-right">
                        <h3 className="text-2xl font-black text-white flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-indigo-500" />
                            خريطة الفوز
                        </h3>
                        <p className="text-gray-500 text-sm font-bold">رحلة الـ ٣٠ يوماً نحو القمة</p>
                    </div>

                    <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/5">
                        <MapStatus label="منجز" color="bg-emerald-500" />
                        <MapStatus label="متاح" color="bg-amber-500" />
                        <MapStatus label="مغلق" color="bg-gray-800" />
                    </div>
                </div>

                <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 md:gap-4">
                    {days.map((day: any) => {
                        const evalForDay = myEvaluations.find((e: any) => e.dayId === day.id)
                        return (
                            <DayCard
                                key={day.dayNumber}
                                day={{
                                    ...day,
                                    title: `اليوم ${day.dayNumber}`,
                                    isDone: completedDayIds.has(day.id),
                                    score: evalForDay?.score
                                }}
                            />
                        )
                    })}
                </div>
            </section>
        </div>
    )
}

function HeaderStat({ icon, label, value, color }: { icon: any, label: string, value: any, color: 'amber' | 'emerald' | 'rose' }) {
    const colorClasses = {
        amber: "bg-amber-500/10 border-amber-500/20 text-amber-500",
        emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
        rose: "bg-rose-500/10 border-rose-500/20 text-rose-500",
    }
    return (
        <div className={cn("px-5 py-3 rounded-2xl border-2 flex flex-col items-center min-w-[100px] shadow-xl", colorClasses[color])}>
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</span>
            </div>
            <span className="text-xl font-black tabular-nums leading-none">{value}</span>
        </div>
    )
}

function LeaderCard({ user, isMe, rank, daysCount }: { user: any, isMe: boolean, rank: number, daysCount: number }) {
    return (
        <div className={cn(
            "relative p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all duration-500 group",
            isMe ? "bg-amber-500/10 border-amber-500/30 scale-105 z-10" : "bg-[#0A0A0E] border-white/5 hover:border-white/10"
        )}>
            {rank === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-2xl z-20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-black" />
                    الأول
                </div>
            )}

            <div className={cn(
                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-xl",
                `bg-${user.theme.color}-500/10 text-${user.theme.color}-500 border border-${user.theme.color}-500/20 group-hover:scale-110 group-hover:rotate-6`
            )}>
                <user.theme.icon className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
                <div className="font-black text-md text-white tracking-tight truncate max-w-[100px]">{user.name}</div>
                <div className="flex items-center justify-center gap-1 text-emerald-500 font-black">
                    <span className="text-xs tabular-nums">{user.score}</span>
                    <span className="text-[9px] uppercase tracking-tighter">نقطة</span>
                </div>
            </div>

            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={cn("h-full transition-all duration-1000", `bg-${user.theme.color}-500`)} style={{ width: `${Math.min(100, (user.score / (daysCount * 100)) * 100)}%` }} />
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black text-gray-600 uppercase">Rank #{rank}</span>
            </div>
        </div>
    )
}

function MapStatus({ label, color }: { label: string, color: string }) {
    return (
        <div className="flex items-center gap-2 px-2">
            <div className={cn("w-2 h-2 rounded-full", color)} />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
        </div>
    )
}

function HeartIconComp({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}
