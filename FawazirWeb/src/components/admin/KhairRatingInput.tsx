'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { adminRateCharity, adminDeleteKhairEntry } from '@/actions/khair'
import { Check, Loader2, Sparkles, X, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface KhairRatingInputProps {
    userId: string
    dayNumber: number
    playerName: string
    deeds: string[]
    initialScore: number
}

export function KhairRatingInput({ userId, dayNumber, playerName, deeds, initialScore }: KhairRatingInputProps) {
    const [score, setScore] = useState(initialScore)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [tempScore, setTempScore] = useState(initialScore)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
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
            await adminRateCharity(userId, dayNumber, tempScore)
            setScore(tempScore)
            setIsEditing(false)
        } catch (error) {
            console.error(error)
            alert('فشل في حفظ التقييم')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete() {
        setIsLoading(true)
        try {
            await adminDeleteKhairEntry(userId, dayNumber)
            window.location.reload()
        } catch (error) {
            console.error(error)
            alert('فشل في حذف السجل')
        } finally {
            setIsLoading(false)
        }
    }

    if (deeds.length === 0 && score === 0) {
        return <span className="text-gray-700 text-[10px]">-</span>
    }

    const modalContent = (
        <AnimatePresence>
            {isEditing && (
                <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsEditing(false)}
                    />

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="relative w-full max-w-lg bg-[#0D0D11] border-t-2 sm:border-2 border-white/10 rounded-t-[3rem] sm:rounded-[3.5rem] p-8 sm:p-12 shadow-[0_-20px_100px_rgba(0,0,0,0.5)] flex flex-col gap-10 max-h-[95vh] overflow-y-auto custom-scrollbar z-[100000]"
                    >
                        {/* Pull Bar for Mobile */}
                        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-2 sm:hidden shrink-0" />

                        {/* Modal Header */}
                        <div className="flex items-start justify-between shrink-0">
                            <div className="space-y-1.5">
                                <h3 className="text-3xl font-black text-white leading-none">{playerName}</h3>
                                <div className="flex items-center gap-2 text-amber-500">
                                    <ShieldCheck className="w-4 h-4" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">مراجعة أعمال اليوم {dayNumber}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsEditing(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Deeds List Section */}
                        <div className="bg-white/[0.02] rounded-[2.5rem] p-6 border border-white/5 space-y-4 shrink-0">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.1em] text-right">قائمة الإنجازات:</p>
                            <ul className="space-y-4 text-right">
                                {deeds.map((d, i) => (
                                    <li key={i} className="text-base text-gray-200 flex flex-row-reverse gap-4 leading-relaxed group">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                        <span className="font-bold">{d}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Rating Display Section */}
                        <div className="text-center space-y-8 py-4 shrink-0">
                            <div className="text-[7rem] font-black text-amber-500 tracking-tighter tabular-nums leading-none drop-shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                                {tempScore}
                            </div>
                            <div className="px-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={tempScore}
                                    onChange={(e) => setTempScore(parseInt(e.target.value))}
                                    className="w-full h-3 bg-gray-800 rounded-full appearance-none cursor-pointer accent-amber-500"
                                />
                            </div>
                        </div>

                        {/* Action Buttons Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="w-full h-20 bg-white text-black font-black text-xl rounded-[2rem] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl"
                            >
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Check className="w-6 h-6" strokeWidth={3} /> اعتماد التقييم</>}
                            </button>

                            <button
                                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                                className={cn(
                                    "w-full h-20 border-2 rounded-[2rem] flex items-center justify-center gap-3 transition-all font-black text-lg",
                                    showDeleteConfirm ? "bg-rose-500 text-white border-rose-400" : "bg-white/5 border-white/10 text-rose-500"
                                )}
                            >
                                <Trash2 className="w-6 h-6" />
                                <span>{showDeleteConfirm ? "تأكيد؟" : "حذف السجل"}</span>
                            </button>
                        </div>

                        {showDeleteConfirm && (
                            <div className="p-6 bg-rose-500/10 border-2 border-rose-500/20 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4 shrink-0">
                                <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
                                <p className="text-[11px] text-rose-200 font-black leading-relaxed text-right">سيتم حذف هذا السجل بشكل نهائي ولن تتمكن من استعادته. سيتمكن المتسابق من الإدخال مرة أخرى.</p>
                                <button
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="mr-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-lg transition-colors"
                                >
                                    حذف نهائي
                                </button>
                            </div>
                        )}

                        <div className="h-4 shrink-0 sm:hidden" /> {/* Extra bottom padding for mobile */}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )

    return (
        <div className="relative">
            <button
                onClick={() => setIsEditing(true)}
                className={cn(
                    "group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:scale-105 active:scale-95",
                    score > 0
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        : "bg-sky-500/10 border-sky-500/20 text-sky-500 animate-pulse"
                )}
            >
                <span className="text-[10px] font-black">{score > 0 ? score : 'قيد المراجعة'}</span>
                <Sparkles className="w-3 h-3" />
            </button>

            {mounted && createPortal(modalContent, document.body)}
        </div>
    )
}
