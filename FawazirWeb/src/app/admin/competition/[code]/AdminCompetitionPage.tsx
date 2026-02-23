'use client'

import React, { useState } from 'react'
import { Users, Calendar, Copy, Star, Activity, CheckCircle, Zap, ShieldCheck, ArrowLeft, Clock, Check, LayoutDashboard, BarChart2, Bell, Settings, Target } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import type { Competition, Day, Participation, Submission, CompetitionStats } from '@/types'

interface AdminCompetitionPageProps {
    competition: Competition
    days: Day[]
    participants: Participation[]
    recentSubmissions: Submission[]
    stats: CompetitionStats
    adminName: string
}

const containerVars = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function AdminCompetitionPage({ competition, days, participants, recentSubmissions, stats, adminName }: AdminCompetitionPageProps) {
    const [isCopied, setIsCopied] = useState(false)

    const copyCode = () => {
        navigator.clipboard.writeText(competition.code)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 3000)
    }

    return (
        <motion.div
            variants={containerVars}
            initial="hidden"
            animate="show"
            className="space-y-10 pb-20"
        >
            {/* ── Minimalist Premium Header ── */}
            <motion.div variants={itemVars} className="relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 p-8 md:p-12 shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50/50 blur-[100px] -ml-32 -mb-32 pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 text-right">
                    <div className="space-y-6 max-w-2xl ml-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">لوحة القيادة</span>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                                {competition.title}
                            </h1>
                            <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed max-w-lg ml-auto mr-0">
                                أهلاً بك يا <span className="text-indigo-600 font-bold">{adminName}</span>.
                                تتبع أداء المتسابقين وأشرف على سير المنافسة من هنا.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 flex items-center gap-4 shadow-sm hover:bg-white hover:border-indigo-100 transition-all group/stat">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform group-hover/stat:scale-110">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900 leading-none">{participants.length}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">متسابق</p>
                            </div>
                        </div>
                        <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 flex items-center gap-4 shadow-sm hover:bg-white hover:border-amber-100 transition-all group/stat">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200 transition-transform group-hover/stat:scale-110">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900 leading-none">{stats.activeDays}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">يوم نشط</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Navigation Hub ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickLink
                    href={`/admin/competition/${competition.code}/content`}
                    title="إدارة المحتوى"
                    desc="الأيام والمهام والأسئلة"
                    icon={<Calendar className="w-6 h-6" />}
                    color="indigo"
                    variants={itemVars}
                />
                <QuickLink
                    href={`/admin/competition/${competition.code}/progress`}
                    title="النتائج والتقدم"
                    desc="تقييم المتسابقين والنجوم"
                    icon={<BarChart2 className="w-6 h-6" />}
                    color="amber"
                    variants={itemVars}
                />
                <motion.div
                    variants={itemVars}
                    onClick={copyCode}
                    className="group relative p-8 bg-gray-900 rounded-[2rem] overflow-hidden cursor-pointer active:scale-[0.98] transition-all text-right h-full flex flex-col justify-between"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />

                    <AnimatePresence mode="wait">
                        {isCopied ? (
                            <motion.div
                                key="copied"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center gap-2 z-20"
                            >
                                <CheckCircle className="w-8 h-8 text-white" />
                                <span className="text-sm font-bold text-white">تم النسخ بنجاح</span>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                    <Copy className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">رمز الانضمام</p>
                                    <p className="text-3xl font-mono font-bold text-amber-400 tracking-[0.2em]">{competition.code}</p>
                                </div>
                                <div className="text-[9px] font-bold text-white/40 bg-white/5 inline-block px-3 py-1 rounded-full border border-white/5">أضغط للنسخ</div>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* ── Detailed Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatSimple label="إجمالي الأيام" value={days.length} sub="خطة المسابقة" icon={<Calendar />} variants={itemVars} />
                <StatSimple label="المشاركات" value={stats.submissionsCount} sub="تم استلامها" icon={<Star />} variants={itemVars} />
                <StatSimple label="نسبة التفاعل" value={`${stats.engagement}%`} sub="تفاعل يومي" icon={<Activity />} variants={itemVars} />
                <StatSimple label="حالة النظام" value="مستقر" sub="يعمل بكفاءة" icon={<Activity />} variants={itemVars} />
            </div>

            {/* ── Live Activity Stream ── */}
            <motion.div variants={itemVars} className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 shadow-sm"><Clock className="w-5 h-5" /></div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">آخر النشاطات</h3>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        مباشر الآن
                    </div>
                </div>

                <div className="space-y-3">
                    {recentSubmissions.length === 0 ? (
                        <div className="bg-white border border-gray-100 rounded-[2rem] p-20 text-center space-y-4">
                            <Target className="w-12 h-12 text-gray-100 mx-auto" />
                            <p className="text-gray-400 font-bold text-sm">لا توجد أي مشاركات جديدة حالياً</p>
                        </div>
                    ) : (
                        recentSubmissions.map((sub: any) => (
                            <div key={sub.id} className="group bg-white border border-gray-100 rounded-3xl p-4 sm:p-6 flex items-center justify-between transition-all hover:border-indigo-100 hover:shadow-sm">
                                <div className="flex items-center gap-4 text-right">
                                    <div className="relative">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
                                            {sub.user.displayName?.[0] || '👤'}
                                        </div>
                                        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">{sub.user.displayName}</p>
                                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg border border-indigo-100">يـوم {sub.question.day.dayNumber}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium mt-1">
                                            أتمّ التحدي: <span className="text-gray-600 font-bold">{sub.question.day.title}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    {sub.ratingStars ? (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-100">
                                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                            <span className="text-sm font-bold text-amber-600">{sub.ratingStars} نجوم</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                                            <Clock className="w-3.5 h-3.5 text-gray-300" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">قيد المراجعة</span>
                                        </div>
                                    )}
                                    <span className="text-[9px] font-medium text-gray-300">
                                        {new Date(sub.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

function QuickLink({ href, title, desc, icon, color, variants }: any) {
    return (
        <motion.div variants={variants}>
            <Link href={href} className="group relative p-8 bg-white border border-gray-100 rounded-[2rem] overflow-hidden flex flex-col gap-6 transition-all hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 active:scale-[0.98] text-right">
                <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 opacity-10 transition-transform group-hover:scale-150 duration-700",
                    color === 'indigo' ? "bg-indigo-500" : "bg-amber-500"
                )} />

                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm",
                    color === 'indigo' ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white" : "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white"
                )}>
                    {icon}
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{title}</h3>
                    <p className="text-xs font-medium text-gray-400">{desc}</p>
                </div>

                <div className={cn(
                    "flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider",
                    color === 'indigo' ? "text-indigo-600" : "text-amber-600"
                )}>
                    دخول الآن <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </div>
            </Link>
        </motion.div>
    )
}

function StatSimple({ label, value, sub, icon, variants }: any) {
    return (
        <motion.div variants={variants} className="group bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col justify-between min-h-[140px] hover:border-indigo-100 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <div className="text-right mt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <div className="flex items-baseline justify-end gap-1">
                    <h4 className="text-3xl font-bold text-gray-900">{value}</h4>
                </div>
                {sub && <p className="text-[9px] font-bold text-gray-300 mt-1">{sub}</p>}
            </div>
        </motion.div>
    )
}
