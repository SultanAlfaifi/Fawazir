'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, Lightbulb, Star, Moon, Sun, Loader2, Zap, Trophy, Target } from 'lucide-react'
import { useState, useEffect } from 'react'
import { loadingMessages } from '@/data/loading-messages'
import { cn } from '@/lib/utils'
import MarbleLoader from './MarbleLoader'

interface SultanLoadingProps {
    fullScreen?: boolean
    className?: string
}

export default function SultanLoading({ fullScreen = true, className = "" }: SultanLoadingProps) {
    const [messageIndex, setMessageIndex] = useState(0)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setMessageIndex(Math.floor(Math.random() * loadingMessages.length))
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    if (!mounted) return null

    const containerClasses = fullScreen
        ? "fixed inset-0 z-[99999] flex items-center justify-center bg-white overflow-hidden"
        : `flex flex-col items-center justify-center py-20 ${className}`

    return (
        <div className={containerClasses} dir="rtl">
            {/* ── Cinematic Mesh Background ── */}
            {fullScreen && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 45, 0],
                            x: [0, 50, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-amber-100/40 blur-[120px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -60, 0],
                            x: [0, -30, 0],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-100/30 blur-[100px] rounded-full"
                    />
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
                </div>
            )}

            <div className="relative z-10 flex flex-col items-center gap-20 max-w-2xl px-8 text-center">

                <MarbleLoader />


                {/* ── Cinematic Typography ── */}
                <div className="space-y-8">
                    <div className="flex flex-col items-center gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-6 py-2 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-gray-900/10"
                        >
                            تجهيز المغامرة
                        </motion.div>

                        <h2 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter leading-none">
                            ثوانِ معدودة...
                        </h2>
                    </div>

                    <div className="min-h-[100px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={messageIndex}
                                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="text-2xl md:text-3xl text-gray-400 font-black leading-relaxed max-w-xl mx-auto italic tracking-tight"
                            >
                                {loadingMessages[messageIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── Modern Minimal Footer ── */}
                <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-12 h-px bg-gray-100" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
                        <span className="text-[11px] font-black tracking-widest uppercase">Fawazir Identity</span>
                    </div>
                    <div className="w-12 h-px bg-gray-100" />
                </div>
            </div>

            {/* Glassy Border Accent */}
            <div className="fixed inset-8 border-[0.5px] border-gray-100 pointer-events-none rounded-[3rem]" />
        </div>
    )
}
