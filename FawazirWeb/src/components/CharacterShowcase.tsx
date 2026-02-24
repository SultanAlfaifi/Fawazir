'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Shield, Stethoscope, Cat, MicOff, Zap, Activity, Brain, Flame, Sparkles, Bot, MessageCircle, BrainCircuit, Crown, MessageSquareText } from 'lucide-react'

// Map characters to colors and icons
const CHARACTERS = [
    {
        id: 'najm',
        name: 'نجم',
        role: 'القائد الملهم',
        color: 'emerald',
        accent: 'from-emerald-400 to-teal-600',
        icon: Shield,
        statIcon: Flame,
        description: 'ليس الأقوى جسداً، بل الأقوى حضوراً. كلماته تشعل الحماس في القلوب، وابتسامته تطمئن الفريق في أحلك اللحظات.',
        stats: { str: 75, int: 70, agi: 65 },
        image: '/images/chars/najm.jpg',
    },
    {
        id: 'doctor',
        name: 'دكتور',
        role: 'العقل التحليلي',
        color: 'blue',
        accent: 'from-blue-400 to-indigo-600',
        icon: Stethoscope,
        statIcon: Brain,
        description: 'يرى ما لا يراه الآخرون. يفكك الأحداث إلى تفاصيل صغيرة ويعيد تركيبها بصورة منطقية دقيقة. هدوؤه هو سلاحه.',
        stats: { str: 40, int: 98, agi: 60 },
        image: '/images/chars/doctor.jpg',
    },
    {
        id: 'bissa',
        name: 'بسة',
        role: 'الروح المرحة',
        color: 'orange',
        accent: 'from-orange-400 to-amber-600',
        icon: Cat,
        statIcon: Zap,
        description: 'فضولها لا يتوقف، وحماسها معدٍ. قد تبدو مرحة ولطيفة، لكن سرعتها وذكاءها يجعلانها عنصر المفاجأة في الفريق.',
        stats: { str: 45, int: 75, agi: 95 },
        image: '/images/chars/bissa.jpg',
    },
    {
        id: 'samit',
        name: 'صامت',
        role: 'القوة الهادئة',
        color: 'red',
        accent: 'from-red-500 to-rose-700',
        icon: MicOff,
        statIcon: Activity,
        description: 'لا يتكلم كثيراً، لكنه يراقب كل شيء. عندما يتحرك… يتحرك بحسم. حضوره وحده كفيل بتغيير مجرى المعركة.',
        stats: { str: 95, int: 65, agi: 55 },
        image: '/images/chars/samit.jpg',
    }
]


export function CharacterShowcase() {
    return (
        <div className="relative">
            {/* Horizontal Scroll for Mobile / Grid for Desktop */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 py-6 md:py-10 px-4 md:px-0 snap-x snap-mandatory scrollbar-hide perspective-1000">
                {CHARACTERS.map((char, index) => (
                    <div key={char.id} className="min-w-[75vw] sm:min-w-[60vw] md:min-w-0 snap-center">
                        <PremiumCard char={char} index={index} />
                    </div>
                ))}
            </div>

            {/* Scroll Indicator for Mobile */}
            <div className="flex md:hidden justify-center gap-2 mt-4">
                {CHARACTERS.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white/20"></div>
                ))}
            </div>

            {/* --- SULTANA SECTION --- */}
            <div className="mt-20 md:mt-32 relative px-4 md:px-0">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 blur-3xl rounded-full"></div>

                <div className="relative z-10 bg-gray-900/60 backdrop-blur-xl border border-amber-500/30 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-amber-900/20 group hover:border-amber-500/50 transition-colors duration-500">
                    <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="hidden md:block absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        {/* Avatar/Visual */}
                        <div className="relative shrink-0">
                            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full p-1 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 shadow-2xl shadow-amber-500/40 relative z-10 group-hover:scale-105 transition-transform duration-500">
                                <div className="w-full h-full rounded-full bg-gray-950 overflow-hidden relative flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                                        <BrainCircuit className="w-20 h-20 md:w-28 md:h-28 text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
                                    </div>
                                </div>
                            </div>

                            {/* Orbiting Elements - Desktop Only */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="hidden md:block absolute inset-0 -m-6 border border-amber-500/20 rounded-full border-dashed"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="hidden md:block absolute inset-0 -m-2 border border-amber-300/10 rounded-full border-dotted"
                            />
                        </div>

                        {/* Content */}
                        <div className="text-center md:text-right flex-1 space-y-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs md:text-sm font-bold mb-4 uppercase tracking-[0.2em]">
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                    <span>مرافقتك الذكية</span>
                                </div>
                                <h3 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
                                    سلطانة <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 animate-gradient-x">AI</span>
                                </h3>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
                                    شريكتك الذكية في فك رموز الألغاز واستكشاف خفايا التحدي. سلطانة ليست مجرد ذكاء، بل هي "خازنة الحكمة" التي ترافقك في كل خطوة بفيض من التلميحات والإبداع.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
                                <div className="flex items-center gap-2 text-xs md:text-sm text-amber-200 bg-amber-950/40 px-4 py-2.5 rounded-xl border border-amber-500/20 backdrop-blur-sm">
                                    <BrainCircuit className="w-4 h-4 text-amber-500" />
                                    <span>مدعومة بالذكاء الخارق</span>
                                </div>
                                <div
                                    className="flex items-center gap-2 text-xs md:text-sm text-black bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 px-8 py-3 rounded-2xl font-bold cursor-pointer transition-all shadow-xl shadow-amber-900/40 active:scale-95 group/btn"
                                    onClick={() => window.dispatchEvent(new CustomEvent('openSultanaChat'))}
                                >
                                    <MessageSquareText className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                    <span>استشر سلطانة الآن</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PremiumCard({ char, index }: { char: any, index: number }) {
    const [isFlipped, setIsFlipped] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative h-[460px] md:h-[500px] w-full cursor-pointer"
            style={{ perspective: '1000px', willChange: 'transform' }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="w-full h-full relative"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
                {/* --- FRONT FACE --- */}
                <div
                    className="absolute top-0 left-0 w-full h-full rounded-[2rem] bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 flex flex-col items-center justify-between p-6 overflow-hidden shadow-2xl"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                    {/* Front Face Content - Fades out when flipped */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                        {/* Background Gradient */}
                        <div className="absolute inset-0 opacity-100 pointer-events-none">
                            <Image
                                src={char.image}
                                alt={char.name}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                        {/* Dark overlay for "blackness" and text readability */}
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                        {/* Content */}
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-6 md:py-8">
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-br ${char.accent} flex items-center justify-center mb-6 shadow-lg shadow-${char.color}-500/20 text-white relative overflow-hidden ring-4 ring-white dark:ring-gray-900`}
                                >
                                    <char.icon className="w-14 h-14 md:w-16 md:h-16 relative z-10" strokeWidth={1.5} />
                                </motion.div>

                                <h3 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">{char.name}</h3>

                                <div className={`px-4 py-1.5 rounded-full bg-${char.color}-50 dark:bg-${char.color}-900/30 text-${char.color}-600 dark:text-${char.color}-300 text-xs md:text-sm font-bold border border-${char.color}-100 dark:border-${char.color}-500/30 flex items-center gap-2`}>
                                    <char.statIcon className="w-3 h-3 md:w-4 md:h-4" />
                                    {char.role}
                                </div>
                            </div>

                            <div className="w-full text-center">
                                <span className="text-[10px] md:text-xs font-medium text-white/70 flex items-center justify-center gap-1 opacity-70">
                                    اضغط للكشف
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BACK FACE --- */}
                <div
                    className={`absolute top-0 left-0 w-full h-full rounded-[2rem] bg-gradient-to-br ${char.accent} p-6 flex flex-col justify-between text-white overflow-hidden shadow-2xl`}
                    style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    <div className="absolute inset-0 bg-black/10"></div>

                    {/* Top Content (Scrollable if needed) */}
                    <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
                        <div className="flex items-center gap-2 mb-4 opacity-80">
                            <char.icon className="w-5 h-5" />
                            <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">ملف سري</span>
                        </div>

                        <h4 className="text-2xl font-bold mb-3 leading-tight">قصة {char.name}</h4>
                        <p className="text-sm md:text-base leading-relaxed text-white/90 font-light translate-z-10">
                            {char.description}
                        </p>
                    </div>

                    {/* Bottom Stats (Fixed) */}
                    <div className="relative z-10 pt-4 mt-4 border-t border-white/10">
                        <div className="grid gap-3 bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                            <StatRow label="القوة" value={char.stats.str} />
                            <StatRow label="الذكاء" value={char.stats.int} />
                            <StatRow label="السرعة" value={char.stats.agi} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

function StatRow({ label, value }: { label: string, value: number }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] md:text-xs font-medium opacity-80">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-1.5 md:h-2 bg-black/20 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-white rounded-full"
                />
            </div>
        </div>
    )
}
