'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, BrainCircuit, Trophy, ArrowLeft, Bot, Zap, MessageCircle } from 'lucide-react'

// --- Navbar Component ---
function Navbar() {
    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo Area */}
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image
                            src="/images/logo.png"
                            alt="Fawazir Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight">فوازير</span>
                </div>

                {/* Actions */}
                <Link href="/login" className="group relative overflow-hidden bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:shadow-gray-900/20">
                    <span className="relative z-10 group-hover:text-amber-400 transition-colors duration-300">تسجيل الدخول</span>
                    <div className="absolute inset-0 bg-gray-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
            </div>
        </motion.nav>
    )
}

// --- Hero Section ---
function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-amber-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob" />
                <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-purple-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-[20%] w-72 h-72 bg-pink-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>موسم 2026</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight"
                    >
                        تحدي العقول.. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">بأسلوب جديد.</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto"
                    >
                        منصة فوازير الذكية.. حيث تلتقي المتعة بالمعرفة في تجربة فريدة مدعومة بالذكاء الاصطناعي.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center gap-4 pt-4"
                    >
                        <Link href="/login" className="px-8 py-4 rounded-2xl bg-gray-900 text-white font-bold text-lg shadow-xl shadow-gray-900/20 hover:scale-105 transition-transform flex items-center gap-2">
                            <span>ابدأ التحدي الآن</span>
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <button className="px-8 py-4 rounded-2xl bg-white text-gray-900 border border-gray-200 font-bold text-lg hover:bg-gray-50 transition-colors">
                            كيف يعمل النظام؟
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// --- How It Works Section ---
function HowItWorks() {
    const steps = [
        {
            icon: <Zap className="w-6 h-6 text-amber-600" />,
            title: "سجل دخولك",
            desc: "انضم إلينا بخطوات بسيطة وكن جزءاً من نخبة المفكرين في هذا الموسم."
        },
        {
            icon: <BrainCircuit className="w-6 h-6 text-indigo-600" />,
            title: "حل الفوازير",
            desc: "تحديات يومية متجددة تتطلب ذكاءً وسرعة بديهة. هل أنت مستعد؟"
        },
        {
            icon: <Trophy className="w-6 h-6 text-emerald-600" />,
            title: "اجمع النقاط",
            desc: "نافس الأصدقاء وتصدر قائمة الأوائل واربح جوائز قيمة في نهاية الموسم."
        }
    ]

    return (
        <section className="py-24 bg-gray-50/50 border-t border-gray-100">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-gray-900 mb-4">كيف تعمل المنصة؟</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">ثلاث خطوات تفصلك عن المتعة والمعرفة.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// --- Sultana Showcase ---
function SultanaSection() {
    return (
        <section className="py-24 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-white">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gray-800/50 opacity-10" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px]" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
                                <Bot className="w-4 h-4" />
                                <span>الذكاء الاصطناعي</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black leading-tight">
                                تعرف على <span className="text-amber-500">سلطانة</span>.
                                <br />مساعدك الذكي.
                            </h2>

                            <p className="text-gray-400 text-lg leading-relaxed">
                                ليست مجرد بوت دردشة، بل هي رفيقة دربك في رحلة الفوازير. تلمح لك بذكاء، ترشحك عند الحاجة، وتضيف جواً من المرح لتجربتك.
                            </p>

                            <button className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors inline-flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                <span>تحدث معها الآن</span>
                            </button>
                        </div>

                        {/* Visual Representation */}
                        <div className="relative h-[300px] md:h-[400px] flex items-center justify-center">
                            {/* Abstract 3D shape or Chat UI Mockup */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="relative w-full max-w-sm bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
                            >
                                <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold">سلطانة AI</div>
                                        <div className="text-xs text-green-400">متصل الآن</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gray-700/50 rounded-2xl rounded-tr-none p-4 text-sm text-gray-300">
                                        أهلاً بك يا بطل! جاهز لتحدي اليوم؟ 🌙✨
                                    </div>
                                    <div className="bg-amber-600 rounded-2xl rounded-tl-none p-4 text-sm text-white w-fit mr-auto">
                                        أكيد! عطيني تلميح بس 😉
                                    </div>
                                    <div className="bg-gray-700/50 rounded-2xl rounded-tr-none p-4 text-sm text-gray-300">
                                        ما يغلى عليك.. ركز في الألوان زين! 🎨
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// --- Footer ---
function Footer() {
    return (
        <footer className="py-12 border-t border-gray-100 bg-white">
            <div className="container mx-auto px-6 flex flex-col items-center">
                <div className="w-12 h-12 relative mb-4">
                    <Image
                        src="/images/logo.png"
                        alt="Fawazir Logo"
                        fill
                        className="object-contain filter grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                    />
                </div>
                <p className="text-gray-400 text-sm font-medium">© 2026 فوازير. جميع الحقوق محفوظة.</p>
            </div>
        </footer>
    )
}

export default function Home() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-amber-100 selection:text-amber-900">
            <Navbar />
            <main>
                <Hero />
                <HowItWorks />
                <SultanaSection />
            </main>
            <Footer />
        </div>
    )
}
