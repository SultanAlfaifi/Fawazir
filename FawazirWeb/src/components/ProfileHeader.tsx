'use client'

import { useState } from 'react'
import { updateProfile } from '@/actions/player'
import { Pencil, X, Save, User as UserIcon, ShieldCheck, Sparkles } from 'lucide-react'
import { CHARACTER_THEMES, CharacterType } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface ProfileHeaderProps {
    user: {
        displayName: string | null
        bio: string | null
        traits: string | null
        character: string | null
    }
    stats: {
        points: number
        level?: number
    }
}

export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
    const [isEditing, setIsEditing] = useState(false)

    const characterId = (user.character as CharacterType) || 'NAJM'
    const theme = CHARACTER_THEMES[characterId] || CHARACTER_THEMES.NAJM
    const ThemeIcon = theme.icon

    return (
        <div className="relative group">
            {/* Main Container with Glassmorphism */}
            <div className={cn(
                "relative overflow-hidden rounded-[3rem] p-8 md:p-12 border-2 transition-all duration-700 shadow-2xl",
                "bg-[#0D0D11]/80 backdrop-blur-2xl border-white/5 group-hover:border-white/10"
            )}>
                {/* Dynamic Background Accents */}
                <div className={cn(
                    "absolute -top-24 -right-24 w-64 h-64 blur-[120px] opacity-20 rounded-full transition-all duration-1000 group-hover:opacity-40",
                    `bg-${theme.color}-500`
                )} />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">

                    {/* Character Avatar - Premium Style */}
                    <div className="relative shrink-0">
                        <div className={cn(
                            "w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] flex items-center justify-center relative transition-all duration-500",
                            "bg-gradient-to-br from-gray-900 to-[#0A0A0E] border-2 border-white/10 shadow-inner group-hover:scale-105"
                        )}>
                            <ThemeIcon className={cn("w-16 h-16 md:w-20 md:h-20", `text-${theme.color}-500/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`)} />

                            {/* Animated Rings */}
                            <div className={cn("absolute inset-0 rounded-[2.5rem] border border-white/5 animate-pulse")} />
                            <div className={cn("absolute -inset-1 rounded-[2.8rem] border border-white/5 opacity-50")} />
                        </div>

                        {/* Rank Badge */}
                        <div className={cn(
                            "absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-2xl flex items-center gap-2 border border-white/10 shadow-2xl",
                            "bg-gray-950 text-white whitespace-nowrap"
                        )}>
                            <ShieldCheck className={cn("w-4 h-4", `text-${theme.color}-500`)} />
                            <span className="text-xs font-black tracking-widest uppercase">{theme.label}</span>
                        </div>
                    </div>

                    {/* Profile Identity */}
                    <div className="flex-1 space-y-6 text-center md:text-right w-full">
                        {isEditing ? (
                            <form action={async (formData) => {
                                await updateProfile(formData)
                                setIsEditing(false)
                            }} className="space-y-6 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                                <div className="space-y-4 text-right">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">الاسم (غير قابل للتغيير)</span>
                                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                        </div>
                                        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-gray-400 font-bold text-sm">
                                            {user.displayName}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">حالة البطل (Bio)</span>
                                        <textarea
                                            name="bio"
                                            defaultValue={user.bio || ''}
                                            className="w-full bg-gray-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-amber-500/50 min-h-[100px] text-sm leading-relaxed"
                                            placeholder="اكتب شيئاً يعبر عنك..."
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 text-gray-400 hover:text-white bg-white/5 rounded-2xl text-xs font-black transition-all"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded-2xl text-xs font-black hover:bg-gray-200 transition-all shadow-xl active:scale-95"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>حفظ التعديلات</span>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-1">
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-lg">
                                        {user.displayName}
                                    </h1>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 hover:text-white transition-all active:scale-90"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="px-1 pt-2">
                                    {user.bio ? (
                                        <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                                            {user.bio}
                                        </p>
                                    ) : (
                                        <p className="text-gray-600 text-sm italic font-medium">عرف عن نفسك بكلمات بسيطة...</p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-6">
                                    <div className={cn(
                                        "inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest",
                                        `bg-${theme.color}-500/10 border-${theme.color}-500/20 text-${theme.color}-400`
                                    )}>
                                        <Sparkles className="w-3 h-3" />
                                        {theme.description}
                                    </div>
                                    {user.traits && (
                                        <span className="text-[10px] px-4 py-2 rounded-2xl bg-white/5 text-gray-500 border border-white/5 font-black uppercase tracking-widest">
                                            {user.traits}
                                        </span>
                                    )}
                                </div>
                            </div >
                        )}
                    </div>

                    {/* Vertical Stats Divider */}
                    <div className="hidden md:block w-px h-32 bg-white/5" />

                    {/* Master Stats Hub */}
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center min-w-[140px] shadow-inner group/stat">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover/stat:text-amber-500 transition-colors">المستوى</span>
                            <div className="text-4xl font-black text-white tabular-nums tracking-tighter">
                                {stats.level || 1}
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center min-w-[140px] shadow-inner group/stat">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover/stat:text-emerald-500 transition-colors">النقاط</span>
                            <div className="text-4xl font-black text-white tabular-nums tracking-tighter">
                                {stats.points}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
