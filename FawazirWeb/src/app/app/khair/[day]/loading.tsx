'use client'

import { motion } from 'framer-motion'
import { Heart, Sparkles, Cloud, Sun } from 'lucide-react'

export default function KhairLoading() {
    return (
        <div className="fixed inset-0 z-[100] bg-[#F0F9FF] flex flex-col items-center justify-center gap-8 text-center" dir="rtl">
            {/* Background Atmosphere */}
            <div className="absolute top-20 left-[-10%] opacity-20 animate-pulse">
                <Cloud className="w-64 h-64 text-white" />
            </div>
            <div className="absolute bottom-20 right-[-5%] opacity-10">
                <Sun className="w-96 h-96 text-white" />
            </div>

            <div className="relative">
                {/* Visual Ring */}
                <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full scale-150" />

                {/* Pulsating Icon */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-32 h-32 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(186,230,253,0.5)] border-4 border-white flex items-center justify-center"
                >
                    <Heart className="w-16 h-16 text-emerald-500 fill-emerald-500/10" strokeWidth={2.5} />

                    {/* Tiny Sparkles around */}
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-2 -right-2"
                    >
                        <Sparkles className="w-6 h-6 text-emerald-300" />
                    </motion.div>
                </motion.div>
            </div>

            <div className="space-y-3">
                <h3 className="text-2xl font-black text-[#0C4A6E] tracking-tight">فتح واحة الخير...</h3>
                <div className="flex justify-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: i * 0.2
                            }}
                            className="w-2 h-2 bg-emerald-500 rounded-full"
                        />
                    ))}
                </div>
            </div>

            <p className="text-[#0369A1] text-sm font-bold opacity-60">تُفتَح الأبواب بالعمل الصالح</p>
        </div>
    )
}
