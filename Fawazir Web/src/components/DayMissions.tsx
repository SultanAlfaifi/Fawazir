'use client'

import React, { useState, useTransition } from 'react'
import { CheckCircle2, Circle, ExternalLink, ListChecks, ArrowUpRight, Loader2, Target, Star } from 'lucide-react'
import { toggleTaskByTitle } from '@/actions/tasks'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Mission {
    title: string
    url: string
    points: number
    id: string | null
    status: string
}

export function DayMissions({ missions, dayId }: { missions: Mission[], dayId: string }) {
    const [isPending, startTransition] = useTransition()
    const [activeTask, setActiveTask] = useState<string | null>(null)

    const completedCount = missions.filter(m => m.status === 'DONE').length
    const progress = missions.length > 0 ? (completedCount / missions.length) * 100 : 0

    const handleToggle = (taskTitle: string, currentStatus: string) => {
        if (isPending) return
        setActiveTask(taskTitle)
        startTransition(async () => {
            try {
                await toggleTaskByTitle(dayId, taskTitle, currentStatus !== 'DONE')
            } catch (err) {
                console.error(err)
            } finally {
                setActiveTask(null)
            }
        })
    }

    return (
        <div className="relative overflow-hidden w-full">
            {/* ── Progress Stats ── */}
            <div className="mb-8 space-y-4 px-1">
                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-indigo-600/60 uppercase tracking-[0.2em] block">نسبة الإنجاز</span>
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-gray-900" />
                            <h2 className="text-xl font-black text-gray-950 tracking-tight">قائمة المهام</h2>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black text-gray-950 font-mono italic">
                            {Math.round(progress)}<span className="text-xs ml-0.5 text-gray-400 font-sans not-italic">%</span>
                        </span>
                    </div>
                </div>

                {/* Progress Track */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden relative border border-gray-50">
                    <motion.div
                        className="h-full bg-indigo-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    />
                </div>
            </div>

            {/* ── Missions Grid ── */}
            <div className="grid gap-2.5 relative">
                {missions.length === 0 ? (
                    <div className="py-12 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none">لا توجد مهام نشطة حالياً</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout" initial={false}>
                        {missions.map((task, i) => {
                            const isDone = task.status === 'DONE'
                            const isLoading = activeTask === task.title && isPending

                            return (
                                <motion.div
                                    key={task.title}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className={cn(
                                        "group relative flex items-start gap-4 p-5 rounded-[2rem] border transition-all duration-500",
                                        isDone
                                            ? "bg-emerald-50/30 border-emerald-100/50 opacity-80"
                                            : "bg-white border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 group"
                                    )}
                                >
                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleToggle(task.title, task.status)}
                                        disabled={isPending}
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 shrink-0 mt-0.5",
                                            isDone
                                                ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                                : "bg-gray-50 border-gray-100 text-gray-300 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                            isLoading && "scale-90 border-indigo-600 opacity-50"
                                        )}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                                        ) : isDone ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200 group-hover:bg-indigo-400 transition-all" />
                                        )}
                                    </button>

                                    <div className="flex-1 min-w-0 pt-1">
                                        <div className="flex items-center justify-between gap-3 mb-1">
                                            <h4 className={cn(
                                                "text-[15px] font-black leading-tight break-words transition-all",
                                                isDone ? "text-gray-400 line-through decoration-emerald-500/30" : "text-gray-900"
                                            )}>
                                                {task.title}
                                            </h4>

                                            {task.points > 0 && (
                                                <div className={cn(
                                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 border transition-all",
                                                    isDone
                                                        ? "bg-gray-100/50 border-gray-100 text-gray-300"
                                                        : "bg-amber-50 border-amber-100 text-amber-600 shadow-sm"
                                                )}>
                                                    <Star className={cn("w-3 h-3", !isDone && "fill-amber-500")} />
                                                    <span className="text-[10px] font-black">{task.points}</span>
                                                </div>
                                            )}
                                        </div>

                                        {task.url && !isDone && (
                                            <a
                                                href={task.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black hover:bg-indigo-100 transition-all border border-indigo-100/50"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                فتح الرابط
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}
