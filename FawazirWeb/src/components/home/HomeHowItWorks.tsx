'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Plus } from 'lucide-react'

const taskTypes = [
    { icon: '🎮', name: 'Kahoot', color: 'bg-purple-50/50', border: 'border-purple-100' },
    { icon: '🏅', name: 'رياضة', color: 'bg-emerald-50/50', border: 'border-emerald-100' },
    { icon: '✨', name: 'أعمال خيرية', color: 'bg-amber-50/50', border: 'border-amber-100' },
    { icon: '🧩', name: 'ألعاب خارجية', color: 'bg-indigo-50/50', border: 'border-indigo-100' },
    { icon: '😸', name: 'وأي مهمة تريد', color: 'bg-rose-50/50', border: 'border-rose-100' },
]

export function HomeHowItWorks() {
    return (
        <section className="py-20 md:py-32 bg-white">
            <div className="container mx-auto px-6">

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 md:mb-24 space-y-4"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-gray-950 tracking-tight">تحديات لا محدودة</h2>
                    <p className="text-gray-400 font-bold text-lg md:text-xl">مهام متنوعة تناسب كل الأنشطة</p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-6xl mx-auto">
                    {taskTypes.map((task, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.05, duration: 0.4 }}
                            className={`${task.color} ${task.border} min-w-[160px] md:min-w-[200px] flex-1 p-8 md:p-12 rounded-[3rem] flex flex-col items-center gap-5 text-center border-2 shadow-sm hover:scale-[1.02] transition-all duration-300 transform-gpu group relative`}
                        >
                            <span className="text-5xl md:text-6xl block transform-gpu group-hover:scale-110 transition-transform duration-300">
                                {task.icon}
                            </span>
                            <span className="font-black text-gray-900 text-base md:text-xl tracking-tight leading-tight">
                                {task.name}
                            </span>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 md:mt-32 max-w-4xl mx-auto bg-[#FDFCFB] p-10 md:p-20 rounded-[4rem] border-2 border-white shadow-sm text-center relative overflow-hidden transform-gpu">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >
                        <div className="inline-flex p-5 bg-white rounded-[2.5rem] shadow-sm mb-10 border border-orange-50 transform-gpu">
                            <Trophy className="w-10 h-10 text-orange-500" />
                        </div>
                        <h3 className="text-3xl md:text-6xl font-black text-gray-950 mb-6 tracking-tight">تصنيف آلي ذكي</h3>
                        <p className="text-lg md:text-2xl text-gray-400 font-bold leading-relaxed mb-16 max-w-2xl mx-auto">
                            اترك عناء الحسابات لنا. <br className="hidden md:block" />
                            النقاط، المراكز، والأوسمة.. يتم تحديثها لحظياً وبكل دقة.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            {[
                                { name: 'فارس محمد', pts: '2450 نقطة', rank: 1, color: 'border-orange-200 bg-orange-50/50' },
                                { name: 'سلطان أحمد', pts: '2100 نقطة', rank: 2, color: 'border-gray-100 bg-white' },
                                { name: 'سارة خالد', pts: '1980 نقطة', rank: 3, color: 'border-gray-100 bg-white' },
                            ].map((user, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className={`p-6 rounded-[2.5rem] border-2 ${user.color} flex flex-col items-center gap-3 shadow-xs transform-gpu transition-transform hover:scale-105`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${user.rank === 1 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {user.rank}
                                    </div>
                                    <span className="font-black text-gray-900 text-lg whitespace-nowrap">{user.name}</span>
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{user.pts}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
