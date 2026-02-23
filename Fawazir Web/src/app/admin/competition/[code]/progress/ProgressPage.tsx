'use client'

import React from 'react'
import { Star, Award, TrendingUp, Users, Target, Trophy, Crown, Medal, Sparkles, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Participation, ProgressStats } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

interface ProgressPageProps {
    participants: Participation[]
    stats: ProgressStats
}

const containerVars = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
}

export default function ProgressPage({ participants, stats }: ProgressPageProps) {
    const sorted = [...participants].sort((a, b) => (b.stars || 0) - (a.stars || 0))
    const topThree = sorted.slice(0, 3)
    const remaining = sorted.slice(3)

    return (
        <motion.div
            variants={containerVars}
            initial="hidden"
            animate="show"
            className="relative space-y-12 pb-20 overflow-x-hidden max-w-[100vw]"
        >
            {/* Background Decorations - Optimized for performance */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <motion.div
                    animate={{
                        rotate: [0, 90, 0],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/50 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{
                        rotate: [0, -45, 0],
                        opacity: [0.05, 0.08, 0.05]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-amber-100/50 blur-[80px] rounded-full"
                />
            </div>

            {/* Header Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <ProgressStat
                    label="إجمالي النجوم"
                    value={stats.totalStars}
                    icon={<Star className="w-6 h-6 fill-amber-400 text-amber-400" />}
                    color="amber"
                    desc="أحسنت! المسابقة تشتعل بالحماس"
                />
                <ProgressStat
                    label="نسبة التفاعل"
                    value={`${stats.engagement}%`}
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="emerald"
                    desc="معدل نمو ملحوظ في الأداء"
                />
                <ProgressStat
                    label="المنافسين"
                    value={participants.length}
                    icon={<Users className="w-6 h-6" />}
                    color="indigo"
                    desc="مجتمع فوازير يزداد قوة"
                />
            </div>

            {/* Podium Section - Fun & Modern */}
            {topThree.length > 0 && (
                <div className="space-y-8">
                    <div className="text-center space-y-2">
                        <motion.div variants={itemVars} className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100 shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            فرسان المسابقة
                        </motion.div>
                        <motion.h2 variants={itemVars} className="text-3xl font-bold text-gray-900 tracking-tight">أفضل 3 متصدرين</motion.h2>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-6 items-end max-w-4xl mx-auto px-2 md:px-4">
                        {/* 2nd Place */}
                        {topThree[1] && <PodiumItem participant={topThree[1]} rank={2} color="slate" delay={0.2} />}

                        {/* 1st Place */}
                        {topThree[0] && <PodiumItem participant={topThree[0]} rank={1} color="amber" delay={0.1} isMain />}

                        {/* 3rd Place */}
                        {topThree[2] && <PodiumItem participant={topThree[2]} rank={3} color="indigo" delay={0.3} />}
                    </div>
                </div>
            )}

            {/* Leaderboard Section - Modern List View */}
            <motion.div
                variants={itemVars}
                className="space-y-6 relative z-10"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                    <div className="text-right">
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">ترتيب المتسابقين</h3>
                        <p className="text-sm text-gray-400 font-medium mt-1">المراكز المتبقية وتفاصيل النقاط</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">بناءً على النجوم</button>
                        <button className="px-5 py-2.5 text-gray-400 text-xs font-bold hover:text-gray-600 transition-colors">بناءً على المهام</button>
                    </div>
                </div>

                {/* List Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-10 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400" dir="rtl">
                    <div className="col-span-1">المركز</div>
                    <div className="col-span-5">المتسابق</div>
                    <div className="col-span-3 text-center">الفريق</div>
                    <div className="col-span-2 text-center">النقاط</div>
                    <div className="col-span-1 text-left">الحالة</div>
                </div>

                {/* Participants List - Compact on Mobile */}
                <div className="space-y-2 md:space-y-4">
                    {sorted.map((p, idx) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05, type: 'spring', stiffness: 100, damping: 20 }}
                            className="group relative bg-white border border-gray-100 rounded-[1.25rem] md:rounded-[2.5rem] p-3 md:px-10 md:py-5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 md:hover:-translate-y-1 md:grid md:grid-cols-12 md:items-center md:gap-4 flex items-center"
                            dir="rtl"
                        >
                            {/* Rank Indicator */}
                            <div className="w-10 h-10 md:w-10 md:h-10 shrink-0 md:col-span-1 rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-sm bg-gray-50 border border-gray-100 text-gray-400 group-hover:bg-white transition-colors">
                                {idx + 1}
                            </div>

                            {/* User Identity - Avatar + Name */}
                            <div className="flex-1 md:col-span-5 flex items-center gap-3 md:gap-4 mr-3 md:mr-0">
                                <div className="relative shrink-0">
                                    <div
                                        className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-sm border-2 md:border-4 border-white ring-1 ring-gray-100 transition-transform group-hover:scale-105"
                                        style={{ backgroundColor: p.user.color || '#F3F4F6' }}
                                    >
                                        {p.user.avatar || (p.user.displayName?.[0] || 'U')}
                                    </div>
                                    <div className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 md:w-4 md:h-4 bg-emerald-500 border-2 md:border-[3px] border-white rounded-full shadow-sm" />
                                </div>
                                <div className="text-right truncate">
                                    <p className="font-bold text-gray-900 text-[15px] md:text-lg group-hover:text-indigo-600 transition-colors leading-tight truncate">{p.user.displayName}</p>
                                    <p className="hidden md:block text-[11px] text-gray-400 font-medium tracking-tight truncate max-w-[180px]">{p.user.email}</p>
                                </div>
                            </div>

                            {/* Team - Hidden on small mobile to save vertical space */}
                            <div className="hidden sm:flex md:col-span-3 justify-center">
                                <div className={cn(
                                    "inline-flex items-center gap-2.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl border text-[10px] md:text-[11px] font-bold transition-all",
                                    p.teamId ? "bg-indigo-50/50 border-indigo-100 text-indigo-600 shadow-sm" : "bg-gray-50/50 border-gray-100 text-gray-400"
                                )}>
                                    <div className={cn("w-1 h-1 md:w-1.5 md:h-1.5 rounded-full", p.teamId ? "bg-indigo-400 animate-pulse" : "bg-gray-300")} />
                                    {p.team?.name || 'بدون فريق'}
                                </div>
                            </div>

                            {/* Score - Compact Stars */}
                            <div className="md:col-span-2 flex justify-center ml-2 md:ml-0">
                                <div className="inline-flex items-center gap-1.5 md:gap-3 px-3 py-1.5 md:px-6 md:py-2.5 bg-amber-50/10 md:bg-amber-50/20 rounded-xl md:rounded-[1.25rem] border border-amber-100/30 md:border-amber-100/40 group-hover:bg-amber-50/50 transition-colors">
                                    <Star className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-500" />
                                    <span className="text-lg md:text-xl font-bold text-gray-950 tracking-tight">{p.stars || 0}</span>
                                </div>
                            </div>

                            {/* Status Indicator - Simple Dot on mobile */}
                            <div className="hidden md:flex md:col-span-1 justify-end">
                                <div className="flex items-center gap-2 py-1.5 px-3 bg-emerald-50/50 rounded-full border border-emerald-100/50">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    <span className="text-[10px] md:text-[9px] font-bold text-emerald-600 uppercase tracking-tight">نشط اليوم</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {sorted.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-[3rem] p-24 text-center space-y-6">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full" />
                            <div className="relative w-24 h-24 bg-white rounded-[2rem] border border-gray-100 flex items-center justify-center shadow-xl">
                                <Target className="w-12 h-12 text-gray-200" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-900 font-bold text-lg">لا يوجد متسابقون بعد</p>
                            <p className="text-gray-400 font-medium max-w-xs mx-auto text-sm">كن أول من ينطلق في هذه المغامرة ويبدأ بجمع النجوم!</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}

function PodiumItem({ participant, rank, color, delay, isMain = false }: {
    participant: Participation,
    rank: number,
    color: string,
    delay: number,
    isMain?: boolean
}) {
    const colorClasses = {
        amber: "bg-amber-500 ring-amber-100",
        slate: "bg-slate-500 ring-slate-100",
        indigo: "bg-indigo-600 ring-indigo-100"
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: 'spring', stiffness: 50 }}
            className={cn(
                "flex flex-col items-center group relative w-full",
                isMain ? "order-2 -mt-6 md:-mt-4" : rank === 2 ? "order-1" : "order-3"
            )}
        >
            {/* Background Glow */}
            <div className={cn(
                "absolute inset-0 blur-[60px] opacity-20 rounded-full -z-10",
                rank === 1 ? "bg-amber-400" : rank === 2 ? "bg-slate-400" : "bg-indigo-400"
            )} />

            {/* Avatar Section */}
            <div className="relative mb-3 md:mb-6">
                <div className={cn(
                    "w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] border-[3px] md:border-4 p-1 md:p-1.5 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center text-3xl md:text-4xl shadow-xl",
                    rank === 1 ? "border-amber-400 ring-2 md:ring-4 ring-amber-400/20" :
                        rank === 2 ? "border-slate-300 ring-2 md:ring-4 ring-slate-300/20" :
                            "border-indigo-400 ring-2 md:ring-4 ring-indigo-400/20"
                )}
                    style={{ backgroundColor: participant.user.color || '#F3F4F6' }}
                >
                    {participant.user.avatar || (participant.user.displayName?.[0] || 'U')}
                </div>

                {/* Badge/Rank */}
                <div className={cn(
                    "absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 md:w-9 md:h-9 rounded-xl md:rounded-2xl flex items-center justify-center border-[3px] md:border-4 border-white shadow-xl text-white",
                    rank === 1 ? "bg-amber-500 scale-110 md:scale-125" : rank === 2 ? "bg-slate-500" : "bg-indigo-600"
                )}>
                    {rank === 1 ? <Crown className="w-3 h-3 md:w-4 md:h-4" /> : <span className="text-xs md:text-sm font-black">{rank}</span>}
                </div>
            </div>

            {/* Info Section */}
            <div className="text-center space-y-0.5 md:space-y-1 bg-white/60 backdrop-blur-md px-2 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-3xl border border-white/80 shadow-sm w-full">
                <h4 className="font-bold text-gray-900 truncate max-w-[80px] md:max-w-[120px] text-[13px] md:text-[15px]">{participant.user.displayName}</h4>
                <div className="flex items-center justify-center gap-1 md:gap-1.5">
                    <Star className="w-3 md:w-3.5 h-3 md:h-3.5 fill-amber-400 text-amber-500" />
                    <span className="text-sm md:text-base font-bold text-gray-900">{participant.stars || 0}</span>
                </div>
                <div className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{participant.team?.name || 'بدون فريق'}</div>
            </div>

            {/* Podium Base */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: isMain ? 40 : 20 }}
                className={cn(
                    "w-full max-w-[150px] mt-4 rounded-t-3xl border-x border-t transition-all",
                    rank === 1 ? "bg-gradient-to-b from-amber-50 to-amber-100/10 border-amber-100/50" :
                        rank === 2 ? "bg-gradient-to-b from-slate-50 to-slate-100/10 border-slate-100/50" :
                            "bg-gradient-to-b from-indigo-50 to-indigo-100/10 border-indigo-100/50"
                )}
            />
        </motion.div>
    )
}

type ProgressColor = 'amber' | 'emerald' | 'indigo'

interface ProgressStatProps {
    label: string
    value: string | number
    icon: React.ReactElement
    color: ProgressColor
    desc?: string
}

function ProgressStat({ label, value, icon, color, desc }: ProgressStatProps) {
    return (
        <motion.div
            variants={itemVars}
            className="group relative p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
        >
            <div className={cn(
                "absolute -top-20 -left-20 w-48 h-48 blur-[80px] rounded-full opacity-10 transition-all duration-700 group-hover:scale-150 group-hover:opacity-20",
                color === 'amber' ? "bg-amber-400" : color === 'emerald' ? "bg-emerald-400" : "bg-indigo-400"
            )} />

            <div className="flex items-center justify-between relative z-10">
                <div className="text-right space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-4xl font-bold text-gray-900 tracking-tight">{value}</h4>
                        {color === 'amber' && <Flame className="w-5 h-5 text-amber-500 animate-pulse" />}
                    </div>
                    {desc && <p className="text-[10px] font-medium text-gray-400 mt-2">{desc}</p>}
                </div>
                <div className={cn(
                    "w-16 h-16 rounded-[1.75rem] flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110",
                    color === 'amber' ? "bg-amber-50 text-amber-500 shadow-amber-500/10" :
                        color === 'emerald' ? "bg-emerald-50 text-emerald-500 shadow-emerald-500/10" :
                            "bg-indigo-50 text-indigo-600 shadow-indigo-500/10"
                )}>
                    {icon}
                </div>
            </div>
        </motion.div>
    )
}

