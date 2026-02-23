'use client'

import { Lock, CheckCircle2, Star, Sparkles, Trophy } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface DayCardProps {
    day: {
        id: string
        dayNumber: number
        title: string
        isOpen: boolean
        isDone?: boolean
        openDateString: string
        score?: number
    }
}


export function DayCard({ day }: DayCardProps) {
    if (!day.isOpen) {
        return (
            <div className="relative aspect-[4/5] sm:aspect-square rounded-[2rem] bg-[#0A0A0E] border-2 border-white/5 flex flex-col items-center justify-center p-4 opacity-70 grayscale transition-all hover:opacity-100 hover:border-white/10 group cursor-not-allowed overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

                <div className="absolute top-3 right-4 font-black text-[10px] text-gray-700 uppercase tracking-widest">
                    Day {day.dayNumber}
                </div>

                <div className="bg-white/5 p-4 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-500">
                    <Lock className="w-8 h-8 text-gray-800" />
                </div>

                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">مغلق</span>
                <div className="text-[9px] text-gray-700 mt-2 font-bold tabular-nums">
                    {new Date(day.openDateString).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                </div>
            </div>
        )
    }

    // Open State
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
        >
            <Link
                href={`/app/day/${day.dayNumber}`}
                className={cn(
                    "relative aspect-[4/5] sm:aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center p-5 transition-all group overflow-hidden shadow-2xl",
                    day.isDone
                        ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                        : "bg-[#0A0A0E] border-white/5 hover:border-amber-500/30 hover:bg-[#12121A]"
                )}
            >
                {/* Background Sparkle Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-4 right-5 font-black text-[10px] text-gray-500 group-hover:text-white transition-colors">
                    {day.dayNumber}
                </div>

                <div className={cn(
                    "p-4 rounded-2xl mb-3 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl",
                    day.isDone ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                )}>
                    {day.isDone ? (
                        <Trophy className="w-8 h-8" />
                    ) : (
                        <Star className="w-8 h-8 fill-current" />
                    )}
                </div>

                <span className={cn(
                    "text-xs font-black text-center tracking-tight",
                    day.isDone ? "text-emerald-400" : "text-gray-300 group-hover:text-amber-400"
                )}>
                    {day.title || `تحدي اليوم ${day.dayNumber}`}
                </span>

                {day.score !== undefined && day.score > 0 && (
                    <div className="absolute bottom-4 bg-white text-black text-[10px] font-black px-3 py-1 rounded-full shadow-2xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        {day.score}%
                    </div>
                )}

                {/* Status Dot */}
                <div className={cn(
                    "absolute top-4 left-5 w-1.5 h-1.5 rounded-full",
                    day.isDone ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500 animate-pulse"
                )} />

            </Link>
        </motion.div>
    )
}
