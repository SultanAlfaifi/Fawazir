'use client'

import { useActionState, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { registerPlayer, registerAdmin } from '@/actions/auth'
import { Loader2, ArrowLeft, User, Shield, Check, Palette, Sparkles, Eye, EyeOff, Lock, Mail, Info, CheckCircle2, Trophy, Settings, Star } from 'lucide-react'
import { PLAYER_AVATARS, PLAYER_COLORS } from '@/lib/constants'

export default function RegisterPage() {
    const [role, setRole] = useState<'PLAYER' | 'ADMIN'>('PLAYER')
    const [email, setEmail] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [playerState, playerAction, playerPending] = useActionState(registerPlayer, undefined)
    const [adminState, adminAction, adminPending] = useActionState(registerAdmin, undefined)

    const [selectedAvatar, setSelectedAvatar] = useState(PLAYER_AVATARS[0])
    const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.05 }
        }
    } as const

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }
    } as const

    // Password validation rules
    const rules = [
        { regex: /.{8,}/, text: "8 خانات على الأقل" },
        { regex: /[a-z]/, text: "حرف إنجليزي صغير (a-z)" },
        { regex: /[A-Z]/, text: "حرف إنجليزي كبير (A-Z)" },
        { regex: /[0-9]/, text: "رقم واحد على الأقل (0-9)" },
        { regex: /[^A-Za-z0-9]/, text: "رمز مساند (مثل @ # $ %)" },
        { regex: /^[\x21-\x7E]*$/, text: "بدون مسافات أو أحرف عربية", exclusive: true }
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
    if (strength > 0 && strength < 3) { strengthColor = "bg-red-400"; strengthText = "ضعيفة"; }
    else if (strength >= 3 && strength < 5) { strengthColor = "bg-amber-400"; strengthText = "متوسطة"; }
    else if (strength === 5) { strengthColor = "bg-emerald-400"; strengthText = "قوية جداً!"; }

    const passwordsMatch = password.length > 0 && password === confirmPassword
    const allRulesMet = strength === 5 && password.length > 0 && /^[\x21-\x7E]*$/.test(password);

    return (
        <div className="min-h-screen bg-white md:bg-gray-50 flex items-center justify-center p-0 md:p-10 font-sans text-gray-900 overflow-x-hidden" dir="rtl">

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-5xl relative z-10 grid md:grid-cols-[0.8fr_1.2fr] bg-white md:rounded-[2.5rem] shadow-none md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden"
            >
                {/* Visual Identity Side (Cleaner/Simpler) */}
                <div className="relative p-10 bg-[#0A0A0B] flex flex-col items-center justify-between text-white md:min-h-[700px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.05),transparent)] opacity-40"></div>

                    <motion.div variants={itemVariants} className="text-center relative z-10 space-y-4">
                        <Link href="/" className="inline-flex w-16 h-16 bg-amber-500 rounded-3xl items-center justify-center shadow-lg shadow-amber-500/10 mb-2 group active:scale-95 transition-transform">
                            <Sparkles className="w-8 h-8 text-white" />
                        </Link>
                        <h2 className="text-4xl font-black">فوازير</h2>
                        <p className="text-gray-500 text-xs font-medium opacity-80">الاحتراف يبدأ من هنا</p>
                    </motion.div>

                    {/* Preview Badge - Minimalist Style */}
                    <div className="relative py-12 md:py-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={role}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className="relative group">
                                    <div
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] flex items-center justify-center text-5xl md:text-6xl shadow-2xl relative z-10 transition-all duration-500"
                                        style={{ backgroundColor: role === 'PLAYER' ? selectedColor : '#111827' }}
                                    >
                                        {role === 'PLAYER' ? selectedAvatar : <Shield className="w-12 h-12 md:w-16 md:h-16 text-amber-500" />}
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-4 border-gray-950 z-20 ${role === 'PLAYER' ? 'bg-amber-500' : 'bg-indigo-500'}`}
                                    >
                                        {role === 'PLAYER' ? <Trophy className="w-5 h-5 text-white" /> : <Settings className="w-5 h-5 text-white" />}
                                    </motion.div>
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="font-black text-xl md:text-2xl truncate max-w-[200px] tracking-tight">{displayName || (role === 'PLAYER' ? 'متسابق جاهز' : 'مشرف خبير')}</p>
                                    <span className="text-[10px] font-black tracking-[0.2em] text-amber-500/80 uppercase px-4 py-1.5 border border-amber-500/20 rounded-full">
                                        {role === 'PLAYER' ? 'CHALLENGER' : 'ARCHITECT'}
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <Link href="/login" className="text-[11px] font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
                            <span>تسجيل دخول</span>
                            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                        </Link>
                    </div>
                </div>

                {/* Form Side - Elegant Minimalism */}
                <div className="p-8 md:p-14 bg-white overflow-y-auto max-h-none md:max-h-dynamic">
                    <motion.div variants={itemVariants} className="flex flex-col gap-10">
                        <header className="flex items-center justify-between border-b border-gray-50 pb-8">
                            <div>
                                <h1 className="text-2xl font-black text-gray-950">إنشاء حساب</h1>
                                <p className="text-xs font-bold text-gray-400 mt-1">املاً البيانات للمتابعة</p>
                            </div>
                            <Link href="/login" className="text-xs font-black text-amber-500 hover:text-amber-600 transition-colors bg-amber-50 px-4 py-2 rounded-xl">
                                دخول الحساب
                            </Link>
                        </header>

                        {/* Role Tabs - Simplified */}
                        <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100 transform-gpu">
                            <button
                                type="button"
                                onClick={() => setRole('PLAYER')}
                                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${role === 'PLAYER' ? 'bg-white text-gray-950 shadow-md border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <User className={`w-3.5 h-3.5 inline ml-1.5 ${role === 'PLAYER' ? 'text-amber-500' : ''}`} />
                                لاعب
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('ADMIN')}
                                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${role === 'ADMIN' ? 'bg-white text-gray-950 shadow-md border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Shield className={`w-3.5 h-3.5 inline ml-1.5 ${role === 'ADMIN' ? 'text-indigo-500' : ''}`} />
                                مشرف
                            </button>
                        </div>

                        <form action={role === 'PLAYER' ? playerAction : adminAction} className="space-y-8" noValidate>
                            {role === 'PLAYER' && (
                                <div className="space-y-10 order-last">
                                    {/* AVATAR PICKER - FIXED CLIPPING and IMPROVED DESIGN */}
                                    <div className="space-y-4">
                                        <Label label="شخصية اللاعب (Avatar)" icon={<Sparkles className="w-3 h-3" />} />
                                        <div className="relative -mx-2">
                                            <div className="flex overflow-x-auto gap-4 px-6 py-6 no-scrollbar custom-scrollbar transform-gpu">
                                                {PLAYER_AVATARS.map((avatar) => (
                                                    <button
                                                        key={avatar}
                                                        type="button"
                                                        onClick={() => setSelectedAvatar(avatar)}
                                                        className={`min-w-[64px] h-16 flex items-center justify-center text-3xl rounded-2xl transition-all transform-gpu shadow-sm ${selectedAvatar === avatar ? 'bg-amber-100 scale-110 ring-2 ring-amber-500 ring-offset-4 ring-offset-white shadow-xl' : 'bg-gray-50 opacity-40 hover:opacity-100 hover:bg-gray-100'}`}
                                                    >
                                                        {avatar}
                                                    </button>
                                                ))}
                                            </div>
                                            {/* Scroll indicators */}
                                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                                        </div>
                                    </div>

                                    {/* COLOR PICKER - CLEANER */}
                                    <div className="space-y-4">
                                        <Label label="لون الهوية" icon={<Palette className="w-3 h-3" />} />
                                        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 justify-start">
                                            {PLAYER_COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center border-2 ${selectedColor === color ? 'border-amber-500 scale-115 shadow-md shadow-amber-500/20' : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'}`}
                                                    style={{ backgroundColor: color }}
                                                >
                                                    {selectedColor === color && <Check className="w-4 h-4 text-white stroke-[4]" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <input type="hidden" name="avatar" value={selectedAvatar} />
                                    <input type="hidden" name="color" value={selectedColor} />
                                </div>
                            )}

                            <div className="grid gap-6">
                                <InputField
                                    name="displayName"
                                    label={role === 'PLAYER' ? "الاسم المستعار" : "اسم المشرف الفعلي"}
                                    placeholder="اكتب اسمك هنا"
                                    value={displayName}
                                    onChange={(e: any) => setDisplayName(e.target.value)}
                                    error={role === 'PLAYER' ? playerState?.errors?.displayName : adminState?.errors?.displayName}
                                />
                                <InputField
                                    name="email"
                                    type="email"
                                    label="البريد الإلكتروني"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e: any) => setEmail(e.target.value)}
                                    error={role === 'PLAYER' ? playerState?.errors?.email : adminState?.errors?.email}
                                />
                                <div className="space-y-4">
                                    <InputField
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        label="كلمة المرور"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e: any) => setPassword(e.target.value)}
                                        error={role === 'PLAYER' ? playerState?.errors?.password : adminState?.errors?.password}
                                        rightIcon={
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 p-1">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        }
                                    />
                                    {/* Interactive Progress Bar & Checklist */}
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50 space-y-3">
                                        {/* Progress Bar */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[10px] font-black tracking-wider">
                                                <span className="text-gray-400 uppercase">قوة كلمة المرور</span>
                                                <span className={`${strengthColor.replace('bg-', 'text-')}`}>{strengthText}</span>
                                            </div>
                                            <div className="flex gap-1 h-1.5 w-full bg-gray-200/50 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-500 ease-out ${strengthColor}`} style={{ width: `${strengthPercentage}%` }} />
                                            </div>
                                        </div>

                                        {/* Rules Checklist */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                                            {rules.map((rule, idx) => {
                                                let isMet = false;
                                                if (rule.exclusive) {
                                                    isMet = password.length > 0 && rule.regex.test(password);
                                                } else {
                                                    isMet = rule.regex.test(password);
                                                }

                                                return (
                                                    <div key={idx} className={`flex items-center gap-1.5 text-[10px] font-black transition-colors duration-300 ${isMet ? 'text-emerald-500' : 'text-gray-400'}`}>
                                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${isMet ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-200/50 text-gray-400'}`}>
                                                            {isMet ? <CheckCircle2 className="w-2.5 h-2.5" /> : <div className="w-1 h-1 rounded-full bg-gray-300" />}
                                                        </div>
                                                        <span className="truncate">{rule.text}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <InputField
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        label="تأكيد كلمة المرور"
                                        placeholder="أدخلها مرة أخرى"
                                        value={confirmPassword}
                                        onChange={(e: any) => setConfirmPassword(e.target.value)}
                                        error={password.length > 0 && !passwordsMatch ? ["الكلمتان غير متطابقتين"] : undefined}
                                    />
                                </div>
                                {role === 'PLAYER' && (
                                    <InputField
                                        name="bio"
                                        label="نبذة بسيطة (اختياري)"
                                        placeholder="اكتب شيئاً عنك..."
                                        error={playerState?.errors?.bio}
                                    />
                                )}
                            </div>

                            <SubmitButton
                                pending={role === 'PLAYER' ? playerPending : adminPending}
                                text={role === 'PLAYER' ? "إنشاء حساب لاعب" : "إنشاء حساب مشرف"}
                                disabled={!passwordsMatch || !allRulesMet}
                            />
                        </form>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

function Label({ label, icon }: any) {
    return (
        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mr-2">
            {icon}
            {label}
        </span>
    )
}

function InputField({ name, label, type = "text", placeholder, error, value, onChange, rightIcon }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mr-2">{label}</label>
            <div className="relative">
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className={`w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] text-gray-900 placeholder-gray-300 focus:outline-none focus:bg-white focus:border-amber-500/30 transition-all font-bold text-sm ${error ? 'border-red-500/10 bg-red-50/10' : ''}`}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                {rightIcon && <div className="absolute inset-y-0 left-4 flex items-center">{rightIcon}</div>}
            </div>
            {error && (
                <p className="text-red-500 px-3 text-[10px] font-black">{error[0]}</p>
            )}
        </div>
    )
}

function SubmitButton({ pending, text, disabled }: { pending: boolean, text: string, disabled?: boolean }) {
    return (
        <button
            type="submit"
            disabled={pending || disabled}
            className="w-full py-4.5 bg-gray-950 hover:bg-gray-900 text-white rounded-[1.5rem] font-black text-sm shadow-xl transition-all disabled:opacity-30 disabled:grayscale active:scale-98 flex items-center justify-center gap-3"
        >
            {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                    <span>{text}</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                </>
            )}
        </button>
    )
}
