'use client';

import { useState, Suspense } from 'react';
import { resetPasswordAction } from '@/actions/reset-password';
import { Lock, ArrowLeft, Loader2, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function ResetPasswordForm({ itemVariants }: { itemVariants: any }) {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    // Password validation rules
    const rules = [
        { regex: /.{8,}/, text: "8 خانات على الأقل" },
        { regex: /[a-z]/, text: "حرف إنجليزي صغير (a-z)" },
        { regex: /[A-Z]/, text: "حرف إنجليزي كبير (A-Z)" },
        { regex: /[0-9]/, text: "رقم واحد على الأقل (0-9)" },
        { regex: /[^A-Za-z0-9]/, text: "رمز مساند (مثل @ # $ %)" },
        { regex: /^[\x21-\x7E]*$/, text: "بدون مسافات أو أحرف عربية", exclusive: true } // exclusive means it must match the whole string or be empty, handled specially
    ];

    const getStrength = () => {
        if (!password) return 0;
        let score = 0;
        if (/.{8,}/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score; // Max 5
    };

    const strength = getStrength();
    const strengthPercentage = (strength / 5) * 100;

    let strengthColor = "bg-gray-200";
    let strengthText = "";
    if (strength > 0 && strength < 3) { strengthColor = "bg-red-400"; strengthText = "كلمة مرور ضعيفة"; }
    else if (strength >= 3 && strength < 5) { strengthColor = "bg-amber-400"; strengthText = "كلمة مرور متوسطة"; }
    else if (strength === 5) { strengthColor = "bg-emerald-400"; strengthText = "كلمة مرور قوية جداً!"; }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg(false);

        if (!token) {
            setErrorMsg('رابط غير صالح.');
            return;
        }

        if (password.length < 8) {
            setErrorMsg('يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('كلمتا المرور غير متطابقتين.');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('token', token);
        formData.append('password', password);

        const res = await resetPasswordAction(formData);

        if (res?.error) {
            setErrorMsg(res.error);
        } else if (res?.success) {
            setSuccessMsg(true);
        }

        setIsLoading(false);
    }

    if (!token && !successMsg) {
        return (
            <motion.div variants={itemVariants} className="bg-white/50 backdrop-blur-sm border border-gray-100 p-2 rounded-[2.5rem] shadow-2xl shadow-black/5">
                <div className="bg-white rounded-[2.2rem] p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-red-500">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-gray-900 font-black text-xl mb-1">رابط غير صالح</h3>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
                        يبدو أنك وصلت إلى هذه الصفحة بشكل خاطئ أو أن الرابط قد انتهت صلاحيته.
                    </p>
                    <Link href="/forgot-password" className="w-full py-4 bg-gray-950 hover:bg-gray-800 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-gray-900/20 transition-all flex items-center justify-center gap-2 mt-6">
                        طلب رابط جديد
                    </Link>
                </div>
            </motion.div>
        );
    }

    if (successMsg) {
        return (
            <motion.div variants={itemVariants} className="bg-white/50 backdrop-blur-sm border border-gray-100 p-2 rounded-[2.5rem] shadow-2xl shadow-black/5">
                <div className="bg-white rounded-[2.2rem] p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-emerald-500">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-gray-900 font-black text-xl mb-1">تمت العملية بنجاح!</h3>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
                        لقد تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن الدخول لحسابك بكل أمان.
                    </p>
                    <Link href="/login" className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-6">
                        الانتقال لتسجيل الدخول
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div variants={itemVariants} className="bg-white/50 backdrop-blur-sm border border-gray-100 p-2 rounded-[2.5rem] shadow-2xl shadow-black/5">
            <form onSubmit={handleSubmit} noValidate className="bg-white rounded-[2.2rem] p-8 space-y-6">
                <div className="space-y-5">
                    {/* New Password Input */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mr-2 block">كلمة المرور الجديدة</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                placeholder="••••••••"
                                minLength={8}
                                className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all font-bold text-sm"
                                dir="ltr"
                            />
                        </div>

                        {/* Password Strength Indicator */}
                        <AnimatePresence>
                            {(isPasswordFocused || password.length > 0) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="overflow-hidden space-y-3"
                                >
                                    {/* Progress Bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[10px] font-black tracking-wider">
                                            <span className="text-gray-400 uppercase">قوة كلمة المرور</span>
                                            <span className={`${strengthColor.replace('bg-', 'text-')}`}>{strengthText}</span>
                                        </div>
                                        <div className="flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-500 ease-out ${strengthColor}`} style={{ width: `${strengthPercentage}%` }} />
                                        </div>
                                    </div>

                                    {/* Rules Checklist */}
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        {rules.map((rule, idx) => {
                                            let isMet = false;
                                            if (rule.exclusive) {
                                                isMet = password.length > 0 && rule.regex.test(password);
                                            } else {
                                                isMet = rule.regex.test(password);
                                            }

                                            return (
                                                <div key={idx} className={`flex items-center gap-1.5 text-[10px] font-bold transition-colors duration-300 ${isMet ? 'text-emerald-500' : 'text-gray-400'}`}>
                                                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors duration-300 ${isMet ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-100 text-gray-400'}`}>
                                                        {isMet ? <CheckCircle className="w-2.5 h-2.5" /> : <div className="w-1 h-1 rounded-full bg-gray-300" />}
                                                    </div>
                                                    <span>{rule.text}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mr-2 block">تأكيد كلمة المرور</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                minLength={8}
                                className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all font-bold text-sm"
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
                    className="w-full py-5 bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale group relative overflow-hidden"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span>حفظ كلمة المرور المُحدثة</span>
                            <CheckCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
                        </>
                    )}
                </motion.button>
            </form>
        </motion.div>
    );
}

export default function ResetPasswordPage() {
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
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-dynamic bg-white flex items-center justify-center p-6 font-sans text-gray-900 relative overflow-hidden" dir="rtl">
            {/* ── Background Accents ── */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -right-[5%] w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-[5%] -left-[5%] w-72 h-72 bg-emerald-50 rounded-full blur-3xl opacity-50" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-sm relative z-10"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center space-y-5 mb-10">
                    <div className="inline-flex w-20 h-20 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-[2rem] items-center justify-center shadow-2xl shadow-emerald-500/20 mb-2 -rotate-3">
                        <Lock className="w-10 h-10 text-white rotate-3" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-gray-950">تجديد العبور</h1>
                        <p className="text-gray-500 font-bold text-lg">اختر كلمة مرور قوية لا تُنسى</p>
                    </div>
                </motion.div>

                {/* Secure Data Wrapper */}
                <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}>
                    <ResetPasswordForm itemVariants={itemVariants} />
                </Suspense>

            </motion.div>

            {/* Subtle Decoration */}
            <div className="fixed bottom-8 text-gray-200 pointer-events-none select-none">
                <p className="text-[100px] font-black opacity-[0.03] whitespace-nowrap">SECURE RESET</p>
            </div>
        </div>
    );
}
