'use client'

import { useActionState, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { registerPlayer, registerAdmin } from '@/actions/auth'
import { Loader2, ArrowLeft, User, Shield, Check, Palette, Sparkles } from 'lucide-react'
import { PLAYER_AVATARS, PLAYER_COLORS } from '@/lib/constants'

export default function RegisterPage() {
    const [role, setRole] = useState<'PLAYER' | 'ADMIN'>('PLAYER')

    // Separate actions for clarity
    const [playerState, playerAction, playerPending] = useActionState(registerPlayer, undefined)
    const [adminState, adminAction, adminPending] = useActionState(registerAdmin, undefined)

    const [selectedAvatar, setSelectedAvatar] = useState(PLAYER_AVATARS[0])
    const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900" dir="rtl">

            <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">

                {/* Visual Side (Left on LTR, Right on RTL) */}
                <div className="relative hidden md:flex flex-col items-center justify-center p-12 bg-gray-900 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 text-center space-y-6">
                        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                            <Sparkles className="w-10 h-10 text-amber-500" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">انضم لعالم فوازير</h2>
                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            {role === 'PLAYER'
                                ? 'سجل الآن كلاعب، اختر شخصيتك ولونك المفضل، وابدأ المنافسة في أقوى التحديات.'
                                : 'سجل الآن كمشرف، أنشئ مسابقاتك الخاصة وتحكم بكل التفاصيل.'}
                        </p>
                    </div>

                    {/* Animated Role Preview */}
                    <div className="mt-12 relative w-full max-w-[200px] aspect-square bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
                        {role === 'PLAYER' ? (
                            <motion.div
                                key="player-preview"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl transition-colors duration-500"
                                    style={{ backgroundColor: selectedColor }}
                                >
                                    {selectedAvatar}
                                </div>
                                <span className="font-bold text-sm">المتسابق الجديد</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="admin-preview"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center shadow-xl border-2 border-amber-500">
                                    <Shield className="w-10 h-10 text-amber-500" />
                                </div>
                                <span className="font-bold text-sm text-amber-500">مشرف المنصة</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/login" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-xs font-bold uppercase tracking-wider">
                            <ArrowLeft className="w-4 h-4" />
                            <span>تسجيل الدخول</span>
                        </Link>
                        <h1 className="text-2xl font-black text-gray-900">حساب جديد</h1>
                    </div>

                    {/* Role Toggles */}
                    <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl mb-8">
                        <button
                            onClick={() => setRole('PLAYER')}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'PLAYER' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <User className="w-4 h-4" />
                            لاعب
                        </button>
                        <button
                            onClick={() => setRole('ADMIN')}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'ADMIN' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Shield className="w-4 h-4" />
                            مشرف
                        </button>
                    </div>

                    {role === 'PLAYER' ? (
                        <form action={playerAction} className="space-y-6">
                            <input type="hidden" name="avatar" value={selectedAvatar} />
                            <input type="hidden" name="color" value={selectedColor} />

                            <InputField name="displayName" label="الاسم المستعار" placeholder="اسمك في اللعبة" icon={<User className="w-4 h-4" />} error={playerState?.errors?.displayName} />
                            <InputField name="email" type="email" label="البريد الإلكتروني" placeholder="name@example.com" icon={<ArrowLeft className="w-4 h-4 rotate-90" />} error={playerState?.errors?.email} />
                            <InputField name="password" type="password" label="كلمة المرور" placeholder="••••••••" icon={<Shield className="w-4 h-4" />} error={playerState?.errors?.password} />
                            <InputField name="bio" label="نبذة عنك (اختياري)" placeholder="أحب التحديات..." icon={<Sparkles className="w-4 h-4" />} error={playerState?.errors?.bio} />

                            {/* Avatar Picker */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" />
                                    اختر رمزك
                                </label>
                                <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                                    {PLAYER_AVATARS.map((avatar) => (
                                        <button
                                            key={avatar}
                                            type="button"
                                            onClick={() => setSelectedAvatar(avatar)}
                                            className={`aspect-square flex items-center justify-center text-xl rounded-lg transition-all ${selectedAvatar === avatar ? 'bg-white shadow-md scale-110 ring-2 ring-gray-900' : 'hover:bg-white hover:shadow-sm'
                                                }`}
                                        >
                                            {avatar}
                                        </button>
                                    ))}
                                </div>
                                {playerState?.errors?.avatar && <p className="text-red-500 text-xs font-bold">{playerState.errors.avatar[0]}</p>}
                            </div>

                            {/* Color Picker */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <Palette className="w-3 h-3" />
                                    لونك المفضل
                                </label>
                                <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    {PLAYER_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full transition-transform ${selectedColor === color ? 'scale-125 ring-2 ring-gray-900 ring-offset-2' : 'hover:scale-110'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {selectedColor === color && <Check className="w-4 h-4 text-white mx-auto" />}
                                        </button>
                                    ))}
                                </div>
                                {playerState?.errors?.color && <p className="text-red-500 text-xs font-bold">{playerState.errors.color[0]}</p>}
                            </div>

                            <SubmitButton pending={playerPending} text="إنشاء حساب لاعب" />
                        </form>
                    ) : (
                        <form action={adminAction} className="space-y-6">
                            <InputField name="displayName" label="الاسم" placeholder="اسم المشرف" icon={<User className="w-4 h-4" />} error={adminState?.errors?.displayName} />
                            <InputField name="email" type="email" label="البريد الإلكتروني" placeholder="admin@example.com" icon={<ArrowLeft className="w-4 h-4 rotate-90" />} error={adminState?.errors?.email} />
                            <InputField name="password" type="password" label="كلمة المرور" placeholder="••••••••" icon={<Shield className="w-4 h-4" />} error={adminState?.errors?.password} />

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed font-medium">
                                ⚠️ حساب المشرف يمنحك صلاحيات كاملة لإنشاء وتعديل المسابقات. يرجى التأكد من البيانات.
                            </div>

                            <SubmitButton pending={adminPending} text="إنشاء حساب مشرف" />
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

function InputField({ name, label, type = "text", placeholder, icon, error }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">{label}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                    {icon}
                </div>
                <input
                    name={name}
                    type={type}
                    className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium"
                    placeholder={placeholder}
                />
            </div>
            {error && <p className="text-red-500 text-xs font-bold">{error[0]}</p>}
        </div>
    )
}

function SubmitButton({ pending, text }: { pending: boolean, text: string }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold shadow-lg shadow-gray-900/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : text}
        </button>
    )
}
