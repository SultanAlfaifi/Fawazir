'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarbleLoaderProps {
    className?: string
}

export default function MarbleLoader({ className = "" }: MarbleLoaderProps) {
    return (
        <div className={cn("relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center", className)}>
            {/* Floating Glow */}
            <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full scale-150 animate-pulse" />

            {/* The Marbles Animation */}
            <div className="relative w-full h-full flex items-center justify-center">
                {[
                    { color: 'bg-amber-500', delay: 0, size: 'w-8 h-8' },
                    { color: 'bg-indigo-600', delay: 0.2, size: 'w-10 h-10' },
                    { color: 'bg-emerald-500', delay: 0.4, size: 'w-6 h-6' },
                    { color: 'bg-rose-500', delay: 0.6, size: 'w-7 h-7' }
                ].map((m, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            x: [Math.cos(i) * 40, Math.cos(i + 2) * 50, Math.cos(i) * 40],
                            y: [Math.sin(i) * 40, Math.sin(i + 2) * 50, Math.sin(i) * 40],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: m.delay,
                            ease: "easeInOut"
                        }}
                        className={cn("absolute rounded-full shadow-lg shadow-black/5 blur-[1px]", m.color, m.size)}
                    />
                ))}

                {/* Center Sparkle */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="z-10 bg-white/80 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white"
                >
                    <Sparkles className="w-10 h-10 text-amber-500" />
                </motion.div>
            </div>
        </div>
    )
}
