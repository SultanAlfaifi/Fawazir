'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { saveDailyEvaluation } from '@/actions/evaluations'
import { Check, Loader2, Star, Plus, Minus, X, Sparkles, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface RatingInputProps {
    userId: string
    dayId: string
    initialScore: number
    playerName: string
    dayNumber: number
}

export function RatingInput({ userId, dayId, initialScore, playerName, dayNumber }: RatingInputProps) {
    const [score, setScore] = useState(initialScore)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [tempScore, setTempScore] = useState(initialScore)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (isEditing) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => { document.body.style.overflow = 'auto' }
    }, [isEditing])

    async function handleSave() {
        setIsLoading(true)
        try {
            await saveDailyEvaluation(userId, dayId, tempScore)
            setScore(tempScore)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to save evaluation:', error)
            alert('فشل في حفظ التقييم')
        } finally {
            setIsLoading(false)
        }
    }

    const quickScores = [0, 25, 50, 75, 100]

    const modalContent = (
        <AnimatePresence>
            {isEditing && (
                <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsEditing(false)}
                    />

                    {/* Sliding Card */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="relative w-full max-w-lg bg-[#0A0A0F] border-t-2 sm:border-2 border-white/10 rounded-t-[3rem] sm:rounded-[3.5rem] p-10 pb-12 sm:pb-10 overflow-hidden z-[100000] shadow-[0_-20px_100px_rgba(0,0,0,0.5)]"
                    >
                        {/* Pull Bar for Mobile */}
                        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8 sm:hidden" />

                        <div className="flex flex-col gap-10">
                            {/* Header Section */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-1.5">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                        <Trophy className="w-4 h-4 text-amber-500" />
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">تقييم اليوم {dayNumber}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white tracking-tight">{playerName}</h3>
                                </div>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all active:scale-90"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Massive Numeric Control Section */}
                            <div className="flex flex-col items-center gap-10 py-4">
                                <div className="flex items-center justify-between w-full max-w-xs mx-auto">
                                    <button
                                        onClick={() => setTempScore(Math.max(0, tempScore - 5))}
                                        className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 text-white active:scale-75 transition-all shadow-xl"
                                    >
                                        <Minus className="w-8 h-8" strokeWidth={3} />
                                    </button>

                                    <div className="text-center">
                                        <span className="text-[7.5rem] font-black text-white leading-none tabular-nums tracking-tighter block drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                            {tempScore}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setTempScore(Math.min(100, tempScore + 5))}
                                        className="w-16 h-16 rounded-[1.5rem] bg-amber-500 flex items-center justify-center hover:bg-amber-400 text-black active:scale-75 transition-all shadow-2xl shadow-amber-500/30"
                                    >
                                        <Plus className="w-8 h-8" strokeWidth={3} />
                                    </button>
                                </div>

                                <div className="flex gap-3 justify-center">
                                    {quickScores.map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setTempScore(val)}
                                            className={cn(
                                                "px-5 py-3 text-xs font-black rounded-2xl border transition-all active:scale-90",
                                                tempScore === val
                                                    ? "bg-white border-white text-black shadow-lg"
                                                    : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                                            )}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Button Section */}
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="w-full h-20 bg-white hover:bg-gray-100 text-black font-black text-xl rounded-[2.5rem] flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-6 h-6 text-amber-600" />
                                        <span>اعتماد التقييم</span>
                                        <Check className="w-6 h-6 ml-2" strokeWidth={4} />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )

    return (
        <>
            <button
                onClick={() => {
                    setTempScore(score)
                    setIsEditing(true)
                }}
                className={cn(
                    "group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl border transition-all duration-300",
                    score > 0
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        : "bg-white/5 border-white/5 text-gray-600 hover:text-white"
                )}
            >
                <span className="text-xs font-black">{score > 0 ? score : '-'}</span>
                <Star className={cn("w-2 h-2 mt-0.5", score > 0 ? "fill-amber-500" : "text-gray-700")} />
            </button>

            {mounted && createPortal(modalContent, document.body)}
        </>
    )
}
