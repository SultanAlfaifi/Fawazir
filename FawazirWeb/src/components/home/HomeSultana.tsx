'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bot, Star, MessageCircle, Sparkles } from 'lucide-react'

export function HomeSultana() {
    return (
        <section className="py-20 md:py-32 bg-white overflow-hidden" id="ai">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto bg-[#0A0A0B] rounded-[3rem] p-8 md:p-20 relative overflow-hidden transform-gpu shadow-xl">

                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] pointer-events-none" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-white">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8 text-center lg:text-right"
                        >
                            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-orange-400 text-[11px] font-black uppercase tracking-[0.2em] mx-auto lg:mr-0">
                                <Sparkles className="w-4 h-4" />
                                <span>صديقتك الذكية</span>
                            </div>

                            <h2 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tight">
                                قل "أهلاً" <br />
                                <span className="text-orange-400">سلطانة 😸</span>
                            </h2>

                            <p className="text-gray-400 text-lg md:text-xl font-bold leading-relaxed max-sm:px-4 mx-auto lg:mr-0">
                                رفيقتك في كل لغز وتحدي. تلميحات ذكية ومرح لا ينتهي.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent('openSultanaChat'))}
                                    className="w-full sm:w-auto px-10 py-5 bg-orange-500 text-white rounded-[2rem] font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/10 transform-gpu"
                                >
                                    <MessageCircle className="w-6 h-6" />
                                    <span>دردش معها</span>
                                </button>
                                <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                                    <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                                    <span>Gemini 1.5 Flash</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Visual AI - Subtle Entrance */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative flex items-center justify-center h-full min-h-[350px]"
                        >
                            <div className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-lg relative transform-gpu">
                                {/* Chat Header */}
                                <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                        <Bot className="w-9 h-9 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black">سلطانة</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">متصلة الآن</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Bubbles with staggered entrance */}
                                <div className="space-y-5">
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-white/5 rounded-3xl rounded-tr-none p-5 text-sm md:text-base text-gray-300 font-bold border border-white/5"
                                    >
                                        أهلاً يا بطل! لغز اليوم يبغى له تركيز.. تبي تلميحة؟ 😉😸
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.7 }}
                                        className="bg-orange-500 rounded-3xl rounded-tl-none p-5 text-sm md:text-base text-white font-black w-fit mr-auto shadow-md shadow-orange-500/5"
                                    >
                                        أكيد! علميني بسرعة 😂
                                    </motion.div>
                                </div>
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
