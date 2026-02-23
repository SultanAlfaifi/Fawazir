'use client'

import { useRef, useState, useTransition } from 'react'
import { updateDay, getDayTeams, getAllPlayers, deleteTeam, generateTeams } from '@/actions/admin'
import Link from 'next/link'
import { ArrowRight, Save, Globe, FileText, Type, Users, RefreshCcw, Trash2, UserPlus, Sparkles, Layout, Info, ChevronDown, Users2, Target } from 'lucide-react'
import { ManualTeamForm } from '@/components/admin/ManualTeamForm'
import { cn } from '@/lib/utils'
import { CHARACTER_THEMES, CharacterType } from '@/lib/theme'
import { motion, AnimatePresence } from 'framer-motion'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

export default function EditDayClientPage({
    day,
    initialTeams,
    allPlayers
}: {
    day: any,
    initialTeams: any[],
    allPlayers: any[]
}) {
    const [isTeamsEnabled, setIsTeamsEnabled] = useState(day.isTeamsEnabled)
    const [isPending, startTransition] = useTransition()

    const [content, setContent] = useState(day.content || '')
    const [challengeContent, setChallengeContent] = useState(day.challengeContent || '')

    // Calculate unassigned players
    const assignedPlayerIds = new Set(initialTeams.flatMap((t: any) => t.members.map((m: any) => m.id)))
    const unassignedPlayers = allPlayers.filter(p => !assignedPlayerIds.has(p.id))

    return (
        <form action={updateDay.bind(null, day.id)} className="space-y-8 sm:space-y-12 pb-32 animate-in fade-in duration-700">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white border border-gray-100 p-6 sm:p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 -mr-16 -mt-16 rounded-full blur-3xl opacity-50" />
                <div className="flex items-center gap-5 relative z-10 mr-auto ml-0">
                    <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex flex-col items-center justify-center font-black shadow-xl shadow-gray-900/10 shrink-0">
                        <span className="text-[9px] opacity-60">يوم</span>
                        <span className="text-xl leading-none">{day.dayNumber}</span>
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{day.title || 'تعديل اليوم'}</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">إعدادات المحتوى والفرق</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto relative z-10">
                    <button type="submit" className="flex-1 sm:flex-none px-8 py-4 bg-orange-600 text-white rounded-2xl font-black text-sm hover:bg-orange-700 transition-all active:scale-95 shadow-xl shadow-orange-600/20 flex items-center justify-center gap-3">
                        <Save className="w-5 h-5" />
                        <span>حفظ التغييرات</span>
                    </button>
                    <Link href="/admin/days" className="p-4 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all active:scale-95 border border-gray-100 shrink-0">
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8 sm:space-y-10">
                    {/* Story Content */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-orange-600" />
                            <h3 className="font-black text-lg text-gray-900">محتوى القصة (سر اليوم)</h3>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block text-right">عنوان القصة</label>
                                <input name="title" defaultValue={day.title || ''} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-xl font-black text-gray-900 focus:bg-white focus:border-orange-500 outline-none transition-all text-right" />
                            </div>
                            <div className="space-y-3 text-right">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block">نص القصة (WYSIWYG)</label>
                                <input type="hidden" name="content" value={content} />
                                <RichTextEditor
                                    content={content}
                                    onChange={setContent}
                                    placeholder="اكتب نص القصة هنا..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Challenge Content */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                            <Target className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-black text-lg text-gray-900">المهمة الجوهرية (التحدي)</h3>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block text-right">عنوان التحدي</label>
                                <input name="challengeTitle" defaultValue={day.challengeTitle || ''} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-xl font-black text-gray-900 focus:bg-white focus:border-indigo-500 outline-none transition-all text-right" />
                            </div>
                            <div className="space-y-3 text-right">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block">وصف التحدي التفصيلي (WYSIWYG)</label>
                                <input type="hidden" name="challengeContent" value={challengeContent} />
                                <RichTextEditor
                                    content={challengeContent}
                                    onChange={setChallengeContent}
                                    placeholder="اكتب وصف التحدي هنا..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-24 space-y-8">
                        {/* Status & Display */}
                        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-8 space-y-8 shadow-sm">
                            <div className="flex items-center gap-4 border-b border-gray-50 pb-5 justify-end">
                                <h3 className="font-black text-lg text-gray-900">التحكم والظهور</h3>
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                    <Globe className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block text-right">طريقة الفتح</label>
                                    <select
                                        name="manualOverride"
                                        defaultValue={day.isManualOpen ? 'OPEN' : day.isManualLocked ? 'LOCKED' : 'AUTO'}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs sm:text-sm font-black text-gray-900 outline-none focus:bg-white focus:border-orange-500 cursor-pointer text-right appearance-none"
                                    >
                                        <option value="AUTO">⚡ مجدول تلقائياً</option>
                                        <option value="OPEN">🔓 مفتوح للجميع اﻵن</option>
                                        <option value="LOCKED">🔒 مقفل حالياً</option>
                                    </select>
                                </div>

                                <div className={cn(
                                    "p-5 rounded-3xl border transition-all flex items-center justify-between cursor-pointer",
                                    isTeamsEnabled ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-100 grayscale"
                                )}>
                                    <input
                                        type="checkbox"
                                        name="isTeamsEnabled"
                                        checked={isTeamsEnabled}
                                        onChange={(e) => setIsTeamsEnabled(e.target.checked)}
                                        className="w-6 h-6 accent-orange-600 cursor-pointer"
                                    />
                                    <div className="flex items-center gap-4 text-right">
                                        <div className="space-y-0.5">
                                            <span className="text-sm font-black text-gray-900 block">تفعيل نظام الفرق</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">توسيع نطاق التحدي</span>
                                        </div>
                                        <div className={cn("w-10 h-10 rounded-xl transition-all flex items-center justify-center", isTeamsEnabled ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "bg-white text-gray-300")}>
                                            <Users className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Integrated Team Management */}
                            <AnimatePresence>
                                {isTeamsEnabled && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-6 pt-6 border-t border-gray-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <button
                                                formAction={async () => {
                                                    startTransition(async () => {
                                                        await generateTeams(day.id)
                                                    })
                                                }}
                                                className="p-2.5 bg-gray-50 hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-xl transition-all border border-gray-100 hover:border-orange-100"
                                                title="توزيع الفرق آلياً"
                                            >
                                                <RefreshCcw className={cn("w-4 h-4", isPending && "animate-spin")} />
                                            </button>
                                            <div className="flex items-center gap-2 text-right">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">الفرق المشكلة</h4>
                                                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                                            </div>
                                        </div>

                                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                            {initialTeams.length > 0 ? (
                                                initialTeams.map((team: any, idx: number) => (
                                                    <motion.div
                                                        layout
                                                        key={team.id}
                                                        className="bg-gray-50/50 border border-gray-100 rounded-[1.5rem] p-4 space-y-4 group/team relative"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <button
                                                                formAction={async () => {
                                                                    startTransition(async () => {
                                                                        await deleteTeam(team.id)
                                                                    })
                                                                }}
                                                                className="w-8 h-8 flex items-center justify-center opacity-0 group-hover/team:opacity-100 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            <span className="text-[10px] font-black text-gray-400 flex items-center gap-2">
                                                                الفريق #{idx + 1}
                                                                <Users2 className="w-3.5 h-3.5 opacity-40" />
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {team.members.map((member: any) => {
                                                                const theme = CHARACTER_THEMES[member.character as CharacterType] || CHARACTER_THEMES.NAJM
                                                                const bgClasses: Record<string, string> = {
                                                                    emerald: 'bg-emerald-500',
                                                                    blue: 'bg-blue-500',
                                                                    orange: 'bg-orange-500',
                                                                    red: 'bg-red-500'
                                                                }
                                                                return (
                                                                    <div key={member.id} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-50 shadow-sm">
                                                                        <div className="flex items-center gap-3 pr-2">
                                                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-black text-gray-400 border border-gray-50">
                                                                                {member.displayName?.[0] || 'U'}
                                                                            </div>
                                                                            <span className="text-[11px] font-black text-gray-900 truncate max-w-[100px]">{member.displayName}</span>
                                                                        </div>
                                                                        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px]", bgClasses[theme.color])}>
                                                                            <theme.icon className="w-3 h-3" />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/30">
                                                    <UserPlus className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">لا توجد فرق مشكلة</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Manual creation form */}
                                        <div className="pt-6 border-t border-gray-50">
                                            <ManualTeamForm dayId={day.id} unassignedPlayers={unassignedPlayers} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Tip Pad */}
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10 space-y-3 text-right">
                                <Info className="w-6 h-6 text-orange-500 mb-1" />
                                <h4 className="font-black text-base">نصيحة للإشراف</h4>
                                <p className="text-[10px] font-medium text-gray-400 leading-relaxed">
                                    تحديث الفرق يتم فورياً عند الضغط على أزرار التحكم، أما محتوى اليوم فيحتاج للضغط على "حفظ التغييرات" في الأعلى لتأكيدها.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
