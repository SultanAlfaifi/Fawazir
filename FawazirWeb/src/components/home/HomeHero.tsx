'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy } from 'lucide-react'

export function HomeHero() {
    // Smoother, light transitions for better performance
    const fadeUp = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" as const }
    }

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
            {/* Ultra-Light Background - Completely static to avoid re-paints */}
            {/* Optimized Background - Less blur for mobile performance */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none">
                <div className="absolute -top-[5%] -right-[5%] w-[20rem] md:w-[35rem] h-[20rem] md:h-[35rem] bg-amber-50 rounded-full blur-[80px] md:blur-[120px] opacity-40 md:opacity-60" />
                <div className="absolute -bottom-[5%] -left-[5%] w-[20rem] md:w-[35rem] h-[20rem] md:h-[35rem] bg-indigo-50 rounded-full blur-[80px] md:blur-[120px] opacity-30 md:opacity-50" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 md:space-y-10">

                    {/* Badge */}
                    <motion.div
                        {...fadeUp}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-sm border border-orange-100 text-[11px] font-black text-orange-600 uppercase tracking-widest transform-gpu"
                    >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>منصة المسابقات الأولى</span>
                    </motion.div>

                    {/* Headline - Unified one-piece animation for smoothness */}
                    <div className="space-y-6 md:space-y-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 }}
                            className="text-5xl md:text-8xl font-black text-gray-950 leading-[1.05] tracking-tight transform-gpu"
                        >
                            اصنع مسابقتك. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">كُن القائد.</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
                            className="text-lg md:text-2xl text-gray-400 font-bold max-w-xl leading-relaxed mx-auto transform-gpu"
                        >
                            نظام متكامل لإدارة التحديات اليومية <br /> والأنشطة التفاعلية بكل بساطة.
                        </motion.p>
                    </div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-5 pt-4 w-full sm:w-auto"
                    >
                        <Link
                            href="/register"
                            className="w-full sm:w-auto px-10 py-5 bg-gray-950 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-gray-900/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group transform-gpu"
                        >
                            <span>ابدأ الآن</span>
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 rotate-180" />
                        </Link>

                        <Link
                            href="/login"
                            className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-[2rem] font-black text-lg hover:bg-gray-50 transition-all shadow-sm active:scale-95 transform-gpu"
                        >
                            دخول اللاعبين
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
