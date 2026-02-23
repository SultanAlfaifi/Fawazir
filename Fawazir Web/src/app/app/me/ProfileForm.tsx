'use client'

import { useActionState, useState } from 'react'
import { updateProfile } from '@/actions/profile'
import { Loader2, Palette, Sparkles, Check, Save, User as UserIcon, Edit3, X, Camera, ShieldCheck, Zap } from 'lucide-react'
import { PLAYER_AVATARS, PLAYER_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function ProfileForm({ user }: { user: any }) {
    const [state, action, pending] = useActionState(updateProfile, null)

    // Controlled inputs for Avatars/Colors
    const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || PLAYER_AVATARS[0])
    const [selectedColor, setSelectedColor] = useState(user.color || PLAYER_COLORS[0])
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {!isEditing ? (
                    <motion.div
                        key="view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative"
                    >
                        {/* ── Premium Profile Showcase ── */}
                        <div className="relative bg-white border border-gray-100 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] overflow-hidden group">
                            {/* Decorative Top Banner Area */}
                            <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-gray-50 to-transparent -z-10" />
                            <div className="absolute top-10 right-10 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] -z-10" />
                            <div className="absolute top-20 left-10 w-48 h-48 bg-indigo-500/5 rounded-full blur-[80px] -z-10" />

                            <div className="p-10 md:p-14">
                                <div className="flex flex-col md:flex-row items-center md:items-end gap-10 text-center md:text-right">

                                    {/* Elevated Avatar */}
                                    <div className="relative shrink-0 mb-6 md:mb-0">
                                        <div className="absolute inset-0 bg-black/5 blur-3xl rounded-full scale-110 translate-y-8" />
                                        <div
                                            className="w-44 h-44 md:w-52 md:h-52 flex items-center justify-center rounded-[4rem] text-8xl shadow-2xl relative z-10 border-[12px] border-white transition-all duration-700 group-hover:scale-[1.02]"
                                            style={{ backgroundColor: selectedColor }}
                                        >
                                            {selectedAvatar}
                                        </div>
                                        <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-white border-4 border-white text-amber-500 rounded-3xl flex items-center justify-center shadow-xl z-20 group-hover:rotate-12 transition-transform duration-500">
                                            <ShieldCheck className="w-7 h-7 fill-amber-50" />
                                        </div>
                                    </div>

                                    {/* Identity Details */}
                                    <div className="flex-1 space-y-6 pb-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-center md:justify-end gap-3">
                                                <div className="px-5 py-1.5 bg-gray-950 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-gray-950/20 flex items-center gap-2">
                                                    <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    عضو متميز
                                                </div>
                                                <div className="h-px w-12 bg-gray-100 hidden md:block" />
                                            </div>

                                            <h2 className="text-5xl md:text-7xl font-black text-gray-950 leading-tight tracking-tighter">
                                                {user.displayName}
                                            </h2>

                                            <div className="max-w-xl mx-auto md:mr-0">
                                                {user.bio ? (
                                                    <p className="text-xl font-medium text-gray-500 leading-relaxed italic border-r-4 border-amber-100 pr-6 py-2">
                                                        "{user.bio}"
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-300 font-medium italic pr-6 py-2">أضف نبذة تعريفية لتميز ملفك الشخصي...</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-8 flex flex-wrap items-center justify-center md:justify-start gap-4 flex-row-reverse">
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-10 py-5 bg-gray-950 text-white rounded-[2rem] font-black text-base hover:bg-gray-800 transition-all active:scale-95 shadow-2xl shadow-gray-900/10 flex items-center gap-4"
                                            >
                                                <Edit3 className="w-6 h-6" />
                                                تخصيص الملف
                                            </button>
                                            <div className="px-8 py-5 bg-gray-50/80 backdrop-blur-sm text-gray-400 rounded-[1.75rem] text-[11px] font-black border border-gray-100 uppercase tracking-widest">
                                                ID_TOKEN: {user.id.slice(-8).toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.form
                        key="edit"
                        action={action}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white border-2 border-orange-100 rounded-[3.5rem] p-8 md:p-14 shadow-2xl space-y-12 relative overflow-hidden"
                    >
                        <input type="hidden" name="avatar" value={selectedAvatar} />
                        <input type="hidden" name="color" value={selectedColor} />

                        {/* Form Header */}
                        <div className="flex justify-between items-center bg-gray-50/50 -m-8 md:-m-14 p-8 md:p-12 mb-12 border-b border-gray-100">
                            <div className="flex items-center gap-5 text-right">
                                <div className="w-14 h-14 bg-orange-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-600/30">
                                    <Camera className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-950 tracking-tight">تعديل الهوية</h3>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">Appearance Configuration</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="w-14 h-14 flex items-center justify-center bg-white text-gray-400 hover:text-rose-500 rounded-2xl transition-all border border-gray-100 hover:border-rose-100 active:scale-95 shadow-sm"
                            >
                                <X className="w-7 h-7" />
                            </button>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 pt-8">
                            {/* Inputs */}
                            <div className="space-y-10 text-right">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mr-6 flex items-center justify-end gap-2">
                                        الإسم المستعار
                                        <UserIcon className="w-3.5 h-3.5" />
                                    </label>
                                    <input
                                        name="displayName"
                                        defaultValue={user.displayName}
                                        placeholder="كيف سيراك المجتمع؟"
                                        className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] font-black text-2xl text-gray-950 focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-right"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mr-6 flex items-center justify-end gap-2">
                                        النبذة التعريفية
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </label>
                                    <textarea
                                        name="bio"
                                        defaultValue={user.bio}
                                        rows={4}
                                        placeholder="شاركنا اهتماماتك أو جملتك المفضلة..."
                                        className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] font-medium text-xl text-gray-700 focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-right resize-none"
                                    />
                                </div>
                            </div>

                            {/* Pickers */}
                            <div className="space-y-12 text-right">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-end gap-3 px-6">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">اختر لونك الفريد</label>
                                        <Palette className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex flex-wrap flex-row-reverse gap-4 bg-gray-50 p-8 rounded-[3rem] border border-gray-100">
                                        {PLAYER_COLORS.slice(0, 18).map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(color)}
                                                className={cn(
                                                    "w-10 h-10 rounded-2xl transition-all relative overflow-hidden",
                                                    selectedColor === color ? 'scale-125 shadow-2xl ring-4 ring-white z-10' : 'hover:scale-110 opacity-70 hover:opacity-100'
                                                )}
                                                style={{ backgroundColor: color }}
                                            >
                                                {selectedColor === color && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Check className="w-5 h-5 text-white drop-shadow-md" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-end gap-3 px-6">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">رمز الشخصية</label>
                                        <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    </div>
                                    <div className="grid grid-cols-6 sm:grid-cols-6 md:grid-cols-7 gap-4 h-56 overflow-y-auto scrollbar-hide bg-gray-50 p-8 rounded-[3.5rem] border border-gray-100">
                                        {PLAYER_AVATARS.map((avatar) => (
                                            <button
                                                key={avatar}
                                                type="button"
                                                onClick={() => setSelectedAvatar(avatar)}
                                                className={cn(
                                                    "aspect-square flex items-center justify-center text-3xl rounded-[1.75rem] transition-all",
                                                    selectedAvatar === avatar
                                                        ? 'bg-white shadow-2xl scale-110 ring-2 ring-orange-200 z-10'
                                                        : 'hover:bg-white hover:scale-110 opacity-60 hover:opacity-100'
                                                )}
                                            >
                                                {avatar}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-12 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-4">
                                {state?.success && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-emerald-500 text-white px-8 py-3 rounded-full text-sm font-black flex items-center gap-3 shadow-xl shadow-emerald-500/20"
                                    >
                                        <Check className="w-5 h-5" />
                                        تم تحديث ملفك بنجاح
                                    </motion.div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <button
                                    type="submit"
                                    disabled={pending}
                                    className="flex-1 sm:flex-none px-14 py-6 bg-orange-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-orange-600/30 active:scale-95 disabled:opacity-70"
                                >
                                    {pending ? <Loader2 className="w-7 h-7 animate-spin" /> : <><span>حفظ الهوية الجديدة</span><Save className="w-7 h-7" /></>}
                                </button>
                            </div>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}
