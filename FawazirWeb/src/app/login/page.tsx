'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { login } from '@/actions/auth'
import { Loader2, ArrowLeft, Mail, Lock, Sparkles, ShieldCheck } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
    const [state, action, pending] = useActionState(login, undefined)
    const searchParams = useSearchParams()
    const isVerified = searchParams.get('verified') === 'true'

    // Form variants for staggered animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <div className="min-h-dynamic bg-white flex items-center justify-center p-6 font-sans text-gray-900 relative overflow-hidden" dir="rtl">
            {/* ── Background Accents ── */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -right-[5%] w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-[5%] -left-[5%] w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-50" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-sm relative z-10"
            >
                {/* Logo & Header */}
                <motion.div variants={itemVariants} className="text-center space-y-5 mb-10">
                    <Link href="/" className="inline-flex w-20 h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-[2rem] items-center justify-center shadow-2xl shadow-amber-500/20 mb-2 transition-all hover:scale-105 active:scale-95 group">
                        <Sparkles className="w-10 h-10 text-white transition-transform group-hover:rotate-12" />
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-gray-950">فوازير</h1>
                        <p className="text-gray-500 font-bold text-lg">سجل دخولك للمغامرة</p>
                    </div>
                </motion.div>

                {/* Verification Success Message */}
                {isVerified && (
                    <motion.div
                        variants={itemVariants}
                        className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800"
                    >
                        <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-black">تم تفعيل حسابك بنجاح! يمكنك الدخول الآن.</span>
                    </motion.div>
                )}

                {/* Main Form Card */}
                <motion.div variants={itemVariants} className="bg-white/50 backdrop-blur-sm border border-gray-100 p-2 rounded-[2.5rem] shadow-2xl shadow-black/5">
                    <form action={action} noValidate className="bg-white rounded-[2.2rem] p-8 space-y-6">
                        <div className="space-y-5">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mr-2 block">البريد الإلكتروني</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500/30 transition-all font-bold text-sm"
                                    />
                                </div>
                                {state?.errors?.email && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 border border-red-100/50 mt-2"
                                    >
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                                        {state.errors.email[0]}
                                    </motion.div>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between mr-2 ml-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">كلمة المرور</label>
                                    <Link href="/forgot-password" className="text-[11px] font-bold text-amber-600 hover:text-amber-500 transition-colors" tabIndex={-1}>
                                        نسيت كلمة المرور؟
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500/30 transition-all font-bold text-sm"
                                    />
                                </div>
                                {state?.errors?.password && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 border border-red-100/50 mt-2"
                                    >
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                                        {state.errors.password[0]}
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={pending}
                            className="w-full py-5 bg-gray-950 hover:bg-gray-800 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-gray-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale group relative overflow-hidden"
                        >
                            {pending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>تسجيل الدخول</span>
                                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Footer Links */}
                <motion.div variants={itemVariants} className="mt-10 text-center space-y-6">
                    <p className="text-gray-400 text-sm font-bold">ليس لديك حساب؟</p>
                    <div className="flex flex-col gap-3">
                        <Link href="/register" className="w-full py-4 text-center rounded-2xl border-2 border-gray-100 hover:border-amber-500/50 hover:bg-amber-50 text-gray-700 hover:text-amber-700 font-black text-sm transition-all">
                            إنشاء حساب جديد
                        </Link>
                    </div>
                </motion.div>
            </motion.div>

            {/* Subtle Decoration */}
            <div className="fixed bottom-8 text-gray-200 pointer-events-none select-none">
                <p className="text-[100px] font-black opacity-[0.03] whitespace-nowrap">FAWAZIR IDENTITY</p>
            </div>
        </div>
    )
}
