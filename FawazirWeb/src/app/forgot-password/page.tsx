'use client';

import { useState } from 'react';
import { forgotPasswordAction } from '@/actions/forgot-password';
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertTriangle, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg(false);
        setUserNotFound(false);

        if (!email) {
            setErrorMsg('يرجى إدخال البريد الإلكتروني.');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('email', email);

        const res = await forgotPasswordAction(formData);

        if (res?.error) {
            if (res.error === 'NOT_FOUND') {
                setUserNotFound(true);
            } else {
                setErrorMsg(res.error);
            }
        } else if (res?.success) {
            setSuccessMsg(true);
        }

        setIsLoading(false);
    }

    // Form variants for staggered animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0, scale: 0.95 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 20
            }
        }
    };

    const contentVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3, ease: "easeInOut" as const }
    };

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
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center space-y-5 mb-10">
                    <div className="inline-flex w-20 h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-[2rem] items-center justify-center shadow-2xl shadow-amber-500/20 mb-2 rotate-3">
                        <KeyRound className="w-10 h-10 text-white -rotate-3" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-gray-950">استعادة الحساب</h1>
                        <p className="text-gray-500 font-bold text-lg">لا تقلق، سنرسل لك رابطاً للعودة</p>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div variants={itemVariants} className="bg-white/50 backdrop-blur-sm border border-gray-100 p-2 rounded-[2.5rem] shadow-2xl shadow-black/5">
                    <AnimatePresence mode="wait">
                        {successMsg ? (
                            <motion.div
                                key="success"
                                {...contentVariants}
                                className="bg-white rounded-[2.2rem] p-8 text-center space-y-4"
                            >
                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                                <h3 className="text-emerald-600 font-black text-xl mb-1">تم الإرسال بنجاح!</h3>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
                                    إذا كان البريد مُسجلاً لدينا، ستجد رسالة استعادة العبور في صندوق الوارد.
                                </p>
                                <Link href="/login" className="w-full py-4 bg-gray-950 hover:bg-gray-800 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-gray-900/20 transition-all flex items-center justify-center gap-2 mt-6">
                                    العودة لتسجيل الدخول
                                </Link>
                            </motion.div>
                        ) : userNotFound ? (
                            <motion.div
                                key="not-found"
                                {...contentVariants}
                                className="bg-white rounded-[2.2rem] p-8 text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-blue-500">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <h3 className="text-gray-900 font-black text-xl mb-1">البريد غير مسجل!</h3>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
                                    يبدو أنك لا تمتلك حساباً بهذا البريد الإلكتروني في فوازير. ما رأيك في الانضمام إلينا الآن؟
                                </p>
                                <div className="flex flex-col gap-3 mt-6">
                                    <Link href="/register" className="w-full py-4 bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
                                        إنشاء حساب جديد
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setUserNotFound(false);
                                            setEmail('');
                                        }}
                                        className="w-full py-4 text-center rounded-[1.5rem] border-2 border-gray-100 hover:border-amber-500/50 hover:bg-amber-50 text-gray-700 hover:text-amber-700 font-black text-sm transition-all"
                                    >
                                        تجربة بريد آخر
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                {...contentVariants}
                                onSubmit={handleSubmit}
                                noValidate
                                className="bg-white rounded-[2.2rem] p-8 space-y-6"
                            >
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
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@example.com"
                                                className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500/30 transition-all font-bold text-sm"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {errorMsg && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-xs font-black flex items-center gap-2 border border-red-100/50"
                                    >
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        {errorMsg}
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale group relative overflow-hidden"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>إرسال رابط الاستعادة</span>
                                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer Links */}
                {!successMsg && !userNotFound && (
                    <motion.div variants={itemVariants} className="mt-10 text-center space-y-6">
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-black text-gray-500 hover:text-gray-900 transition-colors group">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            العودة لتسجيل الدخول
                        </Link>
                    </motion.div>
                )}
            </motion.div>

            {/* Subtle Decoration */}
            <div className="fixed bottom-8 text-gray-200 pointer-events-none select-none">
                <p className="text-[100px] font-black opacity-[0.03] whitespace-nowrap">FAWAZIR RECOVERY</p>
            </div>
        </div>
    );
}
