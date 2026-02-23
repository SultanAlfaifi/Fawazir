'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Plus, Minus, Users, CheckCircle, Clock, Calendar, Zap, Save, ChevronDown, ChevronUp, Trash2, CalendarDays, Rocket, Pencil, ArrowUp, ArrowDown, Layers, Link2, X, ListChecks, Check, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBulkDays, updateDaySettings, autoDistributeTeams, deleteDay, deleteAllDays, addSingleDay, updateCompetitionSettings, assignPlayerToTeam, reorderDays } from '@/actions/competition-management'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toaster'
import { PremiumDatePicker } from '@/components/ui/PremiumDatePicker'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

export default function ContentManagementPage({ competition, days, participants, teams }: any) {
    const { toast, confirm } = useToast()
    const [isGenerating, setIsGenerating] = useState(false)
    const [isUpdatingSettings, setIsUpdatingSettings] = useState(false)
    const [duration, setDuration] = useState(10)
    const [activeTab, setActiveTab] = useState<'days' | 'teams'>('days')
    const [startDate, setStartDate] = useState(competition.startDate ? new Date(competition.startDate).toISOString().split('T')[0] : '')

    // Reordering State
    const [isReordering, setIsReordering] = useState(false)
    const [localDays, setLocalDays] = useState(days)
    const [isSavingOrder, setIsSavingOrder] = useState(false)

    // Sync local days when server days change
    React.useEffect(() => {
        setLocalDays(days)
    }, [days])

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsGenerating(true)
        const formData = new FormData()
        formData.append('duration', duration.toString())
        await createBulkDays(competition.id, formData)
        setIsGenerating(false)
    }

    const handleUpdateStartDate = async () => {
        setIsUpdatingSettings(true)
        await updateCompetitionSettings(competition.id, { startDate }, `/admin/competition/${competition.code}/content`)
        setIsUpdatingSettings(false)
    }

    const handleAddDay = async () => {
        await addSingleDay(competition.id, `/admin/competition/${competition.code}/content`)
    }

    const handleDeleteAll = async () => {
        confirm({
            title: 'حذف جميع الأيام',
            message: 'هل أنت متأكد من حذف جميع الأيام؟ لا يمكن التراجع عن هذا الإجراء!',
            type: 'danger',
            onConfirm: async () => {
                await deleteAllDays(competition.id, `/admin/competition/${competition.code}/content`)
                toast('تم حذف جميع الأيام بنجاح', 'success')
            }
        })
    }

    const handleCancelReorder = () => {
        setIsReordering(false)
        setLocalDays(days)
    }

    const moveDay = (index: number, direction: 'up' | 'down') => {
        const newDays = [...localDays]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= newDays.length) return

        const temp = newDays[index]
        newDays[index] = newDays[targetIndex]
        newDays[targetIndex] = temp
        setLocalDays(newDays)
    }

    const handleSaveOrder = async () => {
        setIsSavingOrder(true)
        const orderedIds = localDays.map((d: any) => d.id)
        const result = await reorderDays(orderedIds, `/admin/competition/${competition.code}/content`)
        setIsSavingOrder(false)

        if (result?.success) {
            toast('تم تحديث ترتيب الأيام بنجاح', 'success')
            setIsReordering(false)
        } else {
            toast(result?.error || 'فشل في حفظ الترتيب الجديد', 'error')
        }
    }

    if (days.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in fade-in duration-1000">
                <div className="relative mb-10">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[50px] rounded-full" />
                    <div className="relative w-24 h-24 bg-white border border-gray-100 rounded-3xl flex items-center justify-center text-5xl shadow-sm">
                        ✨
                    </div>
                </div>

                <div className="space-y-3 max-w-sm mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">ابدأ رحلتك الإبداعية</h2>
                    <p className="text-gray-400 text-sm">صمم تجربة لا تُنسى لمتسابقيك. أضف أيام المسابقة وابدأ بوضع التحديات الآن.</p>
                </div>

                <form onSubmit={handleGenerate} className="flex flex-col items-center gap-6 w-full max-w-sm">
                    <div className="w-full space-y-2 text-right">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-2">عدد الأيام المطلوبة</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-xl font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none text-center"
                            placeholder="مثلاً: 30"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full bg-gray-900 text-white rounded-2xl py-4 font-bold hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isGenerating ? 'جاري التجهيز...' : 'إضافة الأيام'}
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20">
            {/* ── Navigation Tabs ── */}
            <div className="sticky top-[75px] z-30 flex justify-center mb-10">
                <div className="inline-flex p-1 bg-gray-100/50 backdrop-blur-md rounded-2xl border border-gray-200/50">
                    <button
                        onClick={() => setActiveTab('days')}
                        className={cn(
                            "px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                            activeTab === 'days'
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <CalendarDays className="w-4 h-4" />
                        إدارة الأيام
                    </button>
                    <button
                        onClick={() => setActiveTab('teams')}
                        className={cn(
                            "px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                            activeTab === 'teams'
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <Users className="w-4 h-4" />
                        توزيع الفرق
                    </button>
                </div>
            </div>

            {activeTab === 'days' ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 space-y-8">
                    {/* ── Action Header Bar ── */}
                    <div className="flex flex-col lg:flex-row items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                        {/* Date Config */}
                        <div className="flex-1 flex items-center gap-4 w-full px-2">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Rocket className="w-5 h-5" />
                            </div>
                            <div className="flex-1 flex items-center gap-4">
                                <div className="flex-1">
                                    <PremiumDatePicker
                                        value={startDate}
                                        onChange={setStartDate}
                                        label="تاريخ البداية"
                                    />
                                </div>
                                <button
                                    onClick={handleUpdateStartDate}
                                    disabled={isUpdatingSettings}
                                    className="px-6 h-12 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all active:scale-95 shrink-0"
                                >
                                    {isUpdatingSettings ? '..' : 'تحديث'}
                                </button>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-gray-100 hidden lg:block" />

                        {/* Quick Controls */}
                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <button
                                onClick={() => setIsReordering(!isReordering)}
                                className={cn(
                                    "px-5 h-12 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                                    isReordering
                                        ? "bg-amber-100 text-amber-700 ring-2 ring-amber-200"
                                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                )}
                            >
                                <Layers className="w-4 h-4" />
                                إعادة الترتيب
                            </button>
                            <button
                                onClick={handleAddDay}
                                className="flex-1 lg:flex-none px-6 h-12 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                إضافة يوم
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                className="w-12 h-12 flex items-center justify-center text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                                title="حذف الكل"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* ── Days List (Wide List on Desktop, Cards on Mobile) ── */}
                    <div className="space-y-4 max-w-6xl mx-auto">
                        {localDays.map((day: any, index: number) => {
                            const isChanged = days[index]?.id !== day.id;
                            return (
                                <DayEditorCard
                                    key={day.id}
                                    day={day}
                                    competition={competition}
                                    competitionStartDate={startDate}
                                    isReordering={isReordering}
                                    onMoveUp={() => moveDay(index, 'up')}
                                    onMoveDown={() => moveDay(index, 'down')}
                                    isFirst={index === 0}
                                    isLast={index === localDays.length - 1}
                                    newDisplayNumber={index + 1}
                                    isChanged={isChanged}
                                />
                            );
                        })}
                    </div>

                    {isReordering && (
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                                <button
                                    onClick={handleCancelReorder}
                                    className="px-6 py-3 text-gray-500 text-sm font-bold hover:text-gray-900"
                                >
                                    إلغاء الترتيب
                                </button>
                                <button
                                    onClick={handleSaveOrder}
                                    disabled={isSavingOrder}
                                    className="flex-1 bg-amber-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {isSavingOrder ? 'جاري الحفظ...' : 'اعتماد الترتيب'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <TeamsManager
                    competition={competition}
                    participants={participants}
                    teams={teams}
                    days={localDays}
                />
            )}
        </div>
    )
}

interface TaskItem {
    id: string
    title: string
    url: string
    points: number
}

function parseDayTasks(tasksJson: string): TaskItem[] {
    try {
        const parsed = JSON.parse(tasksJson || '[]')
        if (Array.isArray(parsed)) {
            return parsed.map((t: any, i: number) => ({
                id: String(i),
                title: t.title || '',
                url: t.url || '',
                points: Number(t.points || 10)
            }))
        }
    } catch { /* ignore */ }
    return []
}

function DayEditorCard({ day, competition, competitionStartDate, isReordering, onMoveUp, onMoveDown, isFirst, isLast, newDisplayNumber, isChanged }: any) {
    const { toast, confirm } = useToast()
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [status, setStatus] = useState(day.visibilityType || 'MANUAL')
    const [isSaving, setIsSaving] = useState(false)
    const [editingPointsTaskId, setEditingPointsTaskId] = useState<string | null>(null)

    const [title, setTitle] = useState(day.title)
    const [challengeTitle, setChallengeTitle] = useState(day.challengeTitle || '')
    const [challengeContent, setChallengeContent] = useState(day.challengeContent || '')
    const [unlockDate, setUnlockDate] = useState(day.unlockDate ? new Date(day.unlockDate).toISOString().split('T')[0] : '')
    const [tasks, setTasks] = useState<TaskItem[]>(parseDayTasks(day.tasksJson || '[]'))

    const addTask = () => {
        setTasks(prev => [...prev, { id: Date.now().toString(), title: '', url: '', points: 10 }])
    }

    const removeTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id))
    }

    const updateTask = (id: string, field: 'title' | 'url' | 'points', value: any) => {
        setTasks(prev => prev.map(t => t.id === id ? {
            ...t,
            [field]: field === 'points' ? Math.min(99, Math.max(0, Number(value))) : value
        } : t))
    }

    const totalPoints = tasks.reduce((sum, t) => sum + (t.points || 0), 0)

    const handleSave = async () => {
        setIsSaving(true)
        await updateDaySettings(day.id, {
            title,
            challengeTitle,
            challengeContent,
            visibilityType: status,
            isManualOpen: status === 'OPEN_NOW',
            unlockDate: status === 'SCHEDULED' ? unlockDate : null,
            tasks: tasks.filter(t => t.title.trim()).map(t => ({
                title: t.title.trim(),
                url: t.url.trim(),
                points: Number(t.points || 0)
            }))
        }, `/admin/competition/${competition.code}/content`)
        setIsSaving(false)
        setIsExpanded(false)
        toast('تم حفظ التعديلات بنجاح', 'success')
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        confirm({
            title: 'حذف اليوم',
            message: `هل أنت متأكد من حذف ${day.title}؟`,
            type: 'danger',
            onConfirm: async () => {
                await deleteDay(day.id, `/admin/competition/${competition.code}/content`)
                toast('تم حذف اليوم بنجاح', 'success')
            }
        })
    }

    return (
        <div className={cn(
            "bg-white border rounded-3xl transition-all overflow-hidden h-fit self-start",
            isExpanded ? "ring-2 ring-indigo-100 shadow-xl border-indigo-200" : "border-gray-100 hover:border-gray-200 shadow-sm",
            isReordering && isChanged && "bg-amber-50/50 border-amber-200"
        )}>
            <div
                className="p-6 flex items-center justify-between cursor-pointer group"
                onClick={() => !isReordering && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-5 text-right overflow-hidden">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 transition-all",
                        isReordering && isChanged
                            ? "bg-amber-100 text-amber-600"
                            : "bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                    )}>
                        {isReordering ? newDisplayNumber : day.dayNumber}
                    </div>
                    <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                            {isEditingTitle ? (
                                <input
                                    autoFocus
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    onBlur={() => setIsEditingTitle(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                                    className="bg-gray-50 border border-indigo-200 rounded-lg px-3 py-0.5 text-base font-bold outline-none w-full"
                                />
                            ) : (
                                <>
                                    <h4 className="text-lg font-bold text-gray-900 truncate tracking-tight">{title}</h4>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
                                        className="p-1 text-gray-300 hover:text-indigo-500 rounded transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                            {day.isManualOpen ? (
                                <span className="text-emerald-600 font-bold">نشط الآن</span>
                            ) : (
                                <span>بانتظار الفتح</span>
                            )}
                            <span>•</span>
                            <span className="truncate italic flex-1">{day.challengeTitle || 'بدون تحدي'}</span>

                            {totalPoints > 0 && (
                                <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100/50 shrink-0">
                                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                    <span className="text-amber-700 font-black text-[10px] leading-none">{totalPoints}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {isReordering ? (
                        <div className="flex gap-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                                disabled={isFirst}
                                className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-lg disabled:opacity-30"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                                disabled={isLast}
                                className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-lg disabled:opacity-30"
                            >
                                <ArrowDown className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDelete}
                                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-rose-500 rounded-lg transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                isExpanded ? "bg-indigo-50 text-indigo-600 rotate-180" : "bg-gray-50 text-gray-400"
                            )}>
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="px-6 pb-8 space-y-8 animate-in slide-in-from-top-2 duration-500">
                    <div className="pt-6 border-t border-gray-100 space-y-8">
                        {/* Status Pickers */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right block mr-1">الإتاحة والظهور</label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                <VisibilityButton icon={<Zap />} label="فتح الآن" active={status === 'OPEN_NOW'} onClick={() => setStatus('OPEN_NOW')} />
                                <VisibilityButton icon={<Clock />} label="يدوي" active={status === 'MANUAL'} onClick={() => setStatus('MANUAL')} />
                                <VisibilityButton icon={<Calendar />} label="مجدول" active={status === 'SCHEDULED'} onClick={() => setStatus('SCHEDULED')} />
                                <VisibilityButton icon={<CheckCircle />} label="آلي" active={status === 'AUTOMATIC'} onClick={() => setStatus('AUTOMATIC')} />
                            </div>

                            {status === 'SCHEDULED' && (
                                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-4 animate-in zoom-in-95 duration-300">
                                    <div className="flex items-center gap-4 text-right">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0"><Calendar className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-none mb-1">تحديد موعد الظهور</p>
                                            <p className="text-sm font-medium text-gray-700">حدد اليوم الذي سيظهر فيه هذا المحتوى للاعبين.</p>
                                        </div>
                                    </div>
                                    <PremiumDatePicker value={unlockDate} onChange={setUnlockDate} label="تاريخ الفتح" />
                                </div>
                            )}
                        </div>

                        {/* Title & Challenge Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2 text-right">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">اسم اليوم</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="اليوم الأول..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-indigo-400 transition-all outline-none text-right"
                                />
                            </div>
                            <div className="space-y-2 text-right">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">عنوان التحدي</label>
                                <input
                                    value={challengeTitle}
                                    onChange={(e) => setChallengeTitle(e.target.value)}
                                    placeholder="مهمة البحث..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-indigo-400 transition-all outline-none text-right"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-right">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">تفاصيل التحدي</label>
                            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm focus-within:border-indigo-400 transition-all">
                                <RichTextEditor
                                    content={challengeContent}
                                    onChange={setChallengeContent}
                                    placeholder="اكتب تعليمات التحدي هنا..."
                                />
                            </div>
                        </div>

                        {/* Task Management */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={addTask}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    إضافة مهمة
                                </button>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">المهام الفرعية ({tasks.length})</span>
                            </div>

                            <div className="space-y-2">
                                {tasks.map((task, i) => (
                                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-2xl border border-gray-100 group/task">
                                        <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 text-xs shrink-0">{i + 1}</div>
                                        <div className="flex-1 space-y-2 text-right min-w-0">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    value={task.title}
                                                    onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                                                    placeholder="وصف المهمة..."
                                                    className="flex-1 bg-transparent border-none p-0 text-sm font-bold text-gray-900 focus:ring-0 placeholder:text-gray-300"
                                                />

                                                {/* Desktop Points Stepper - Star Edition */}
                                                <div className="hidden md:flex items-center gap-1 group/stepper">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateTask(task.id, 'points', task.points - 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-rose-500 transition-all rounded-full hover:bg-rose-50"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>

                                                    <div className="flex items-center gap-1.5 bg-gray-50/50 px-3 py-1.5 rounded-2xl group-hover/stepper:bg-white transition-all">
                                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                                        <input
                                                            type="number"
                                                            max="99"
                                                            value={task.points}
                                                            onChange={(e) => updateTask(task.id, 'points', e.target.value)}
                                                            className="w-8 bg-transparent border-none p-0 text-sm font-black text-gray-900 focus:ring-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => updateTask(task.id, 'points', task.points + 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-indigo-600 transition-all rounded-full hover:bg-indigo-50"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {/* Mobile Points Trigger - Star Edition */}
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingPointsTaskId(task.id)}
                                                    className="md:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-[1.25rem] border border-gray-100 shadow-sm active:scale-95 transition-all"
                                                >
                                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                                                    <span className="text-base font-black text-gray-900">{task.points}</span>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Link2 className="w-3.5 h-3.5 shrink-0" />
                                                <input
                                                    value={task.url}
                                                    onChange={(e) => updateTask(task.id, 'url', e.target.value)}
                                                    placeholder="رابط إضافي..."
                                                    className="w-full bg-transparent border-none p-0 text-[11px] font-medium text-indigo-500 focus:ring-0 placeholder:text-gray-200 text-left"
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                        <button onClick={() => removeTask(task.id)} className="p-2 text-gray-200 hover:text-rose-500 rounded-lg transition-all shrink-0"><X className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full bg-indigo-600 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'انتظر...' : 'حفظ التغييرات الآن'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Mobile Points Drawer ── */}
            <AnimatePresence>
                {editingPointsTaskId && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingPointsTaskId(null)}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] md:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 pb-12 z-[101] md:hidden border-t border-gray-100 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
                        >
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />

                            <div className="text-center space-y-6">
                                <div className="space-y-2">
                                    <h5 className="text-gray-500 font-bold text-xs uppercase tracking-widest">تحديد نقاط المهمة</h5>
                                    <p className="text-gray-900 font-bold text-lg truncate px-4">
                                        {tasks.find(t => t.id === editingPointsTaskId)?.title || 'مهمة بدون عنوان'}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center gap-10 py-6">
                                    <div className="relative">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-4">
                                                <Star className="w-12 h-12 text-amber-500 fill-amber-500 animate-in zoom-in duration-500" />
                                                <input
                                                    type="number"
                                                    max="99"
                                                    value={tasks.find(t => t.id === editingPointsTaskId)?.points}
                                                    onChange={(e) => {
                                                        const val = Math.min(99, Math.max(0, Number(e.target.value)));
                                                        const task = tasks.find(t => t.id === editingPointsTaskId);
                                                        if (task) updateTask(task.id, 'points', val);
                                                    }}
                                                    className="w-32 bg-transparent border-none p-0 text-[100px] font-bold text-gray-900 focus:ring-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none tracking-tighter"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em]">نقطة (الحد الأقصى 99)</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full px-4">
                                        <button
                                            onClick={() => {
                                                const task = tasks.find(t => t.id === editingPointsTaskId);
                                                if (task) updateTask(task.id, 'points', Math.max(0, (task.points || 0) - 1));
                                            }}
                                            className="flex-1 h-16 bg-white rounded-2xl border border-gray-200 flex items-center justify-center text-gray-900 active:bg-gray-50 transition-all"
                                        >
                                            <Minus className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const task = tasks.find(t => t.id === editingPointsTaskId);
                                                if (task && (task.points || 0) < 99) updateTask(task.id, 'points', (task.points || 0) + 1);
                                            }}
                                            className="flex-1 h-16 bg-white rounded-2xl border border-gray-200 flex items-center justify-center text-gray-900 active:bg-gray-50 transition-all"
                                        >
                                            <Plus className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        onClick={() => setEditingPointsTaskId(null)}
                                        className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
                                    >
                                        اعتماد النقاط
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

function VisibilityButton({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all",
                active
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                    : "bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600"
            )}
        >
            {React.cloneElement(icon, { className: "w-4 h-4" })}
            <span>{label}</span>
        </button>
    )
}

function TeamsManager({ competition, participants, teams, days }: any) {
    const { toast, confirm } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [teamCount, setTeamCount] = useState(4)
    const [membersPerTeam, setMembersPerTeam] = useState(5)
    const [distributionMode, setDistributionMode] = useState<'all' | 'custom'>('all')
    const [selectedDayId, setSelectedDayId] = useState(days[0]?.id || '')

    const handleAutoDistribute = async () => {
        setIsLoading(true)
        await autoDistributeTeams(competition.id, teamCount, membersPerTeam)
        setIsLoading(false)
        toast('تم توزيع الفريق بنجاح!', 'success')
    }

    const handleAssignTeam = async (participationId: string, teamId: string | null) => {
        setIsLoading(true)
        await assignPlayerToTeam(participationId, teamId, `/admin/competition/${competition.code}/content`)
        setIsLoading(false)
    }

    const handleClearTeams = async () => {
        confirm({
            title: 'مسح الفرق',
            message: 'هل أنت متأكد من مسح كل الفرق؟',
            type: 'warning',
            onConfirm: async () => {
                setIsLoading(true)
                for (const p of participants) {
                    if (p.teamId) {
                        await assignPlayerToTeam(p.id, null, `/admin/competition/${competition.code}/content`)
                    }
                }
                setIsLoading(false)
                toast('تم مسح الفرق.', 'info')
            }
        })
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 space-y-8">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 lg:p-12 shadow-sm space-y-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-2 text-right">
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">إدارة المتسابقين والفرق</h3>
                        <p className="text-gray-400 text-sm">قم بتقسيم اللاعبين إلى فرق وإدارتهم بشكل يدوي أو آلي.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-gray-100 p-1 rounded-xl flex">
                            <button
                                onClick={() => setDistributionMode('all')}
                                className={cn(
                                    "px-6 py-2 rounded-lg text-xs font-bold transition-all",
                                    distributionMode === 'all' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                            >عام</button>
                            <button
                                onClick={() => setDistributionMode('custom')}
                                className={cn(
                                    "px-6 py-2 rounded-lg text-xs font-bold transition-all",
                                    distributionMode === 'custom' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                            >حسب اليوم</button>
                        </div>
                        <button
                            onClick={handleClearTeams}
                            className="px-6 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all"
                        >مسح</button>
                    </div>
                </div>

                {distributionMode === 'custom' && (
                    <div className="mt-12 flex gap-4 overflow-x-auto pb-6 pt-2 custom-scrollbar rtl scroll-smooth">
                        {days.map((day: any) => (
                            <button
                                key={day.id}
                                onClick={() => setSelectedDayId(day.id)}
                                className={cn(
                                    "px-8 py-4 rounded-[1.75rem] text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                                    selectedDayId === day.id
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-600/30 -translate-y-1"
                                        : "bg-white text-gray-400 border-gray-100 hover:border-indigo-200 hover:text-indigo-600"
                                )}
                            >
                                {day.title}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    {/* Left: Distribution Controls */}
                    <div className="space-y-8 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <Rocket className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">التوزيع الآلي الفوري</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">عدد الفرق</label>
                                <div className="relative flex items-center bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm focus-within:border-indigo-400 transition-all">
                                    <button
                                        onClick={() => setTeamCount(Math.max(1, teamCount - 1))}
                                        className="w-10 sm:w-12 h-14 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-indigo-600 transition-all shrink-0"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="number"
                                        value={teamCount}
                                        onChange={(e) => setTeamCount(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-0 flex-1 h-14 bg-transparent border-none text-center text-xl font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-1"
                                    />
                                    <button
                                        onClick={() => setTeamCount(teamCount + 1)}
                                        className="w-10 sm:w-12 h-14 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-indigo-600 transition-all shrink-0"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">أعضاء كل فريق</label>
                                <div className="relative flex items-center bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm focus-within:border-indigo-400 transition-all">
                                    <button
                                        onClick={() => setMembersPerTeam(Math.max(1, membersPerTeam - 1))}
                                        className="w-10 sm:w-12 h-14 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-indigo-600 transition-all shrink-0"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="number"
                                        value={membersPerTeam}
                                        onChange={(e) => setMembersPerTeam(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-0 flex-1 h-14 bg-transparent border-none text-center text-xl font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-1"
                                    />
                                    <button
                                        onClick={() => setMembersPerTeam(membersPerTeam + 1)}
                                        className="w-10 sm:w-12 h-14 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-indigo-600 transition-all shrink-0"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAutoDistribute}
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white h-16 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10"
                        >
                            {isLoading ? 'جاري التوزيع...' : 'بدء التوزيع الآن'}
                        </button>
                    </div>

                    {/* Right: Players List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="font-bold text-gray-900 text-base">{participants.length} لاعب</h4>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">قائمة المشاركين</span>
                        </div>

                        <div className="space-y-2 max-h-[550px] overflow-y-auto px-6 custom-scrollbar rtl">
                            {participants.map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-all group">
                                    <div className="flex items-center gap-4 text-right">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-gray-400">
                                            {p.user.displayName?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-none mb-1">{p.user.displayName}</p>
                                            <div className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1.5 w-fit",
                                                p.teamId ? "text-indigo-600 border-indigo-100 bg-indigo-50" : "text-gray-300 border-gray-100 bg-gray-50/50"
                                            )}>
                                                <div className={cn("w-1 h-1 rounded-full", p.teamId ? "bg-indigo-500" : "bg-gray-300")} />
                                                {p.team?.name || 'بدون فريق'}
                                            </div>
                                        </div>
                                    </div>

                                    <TeamSelector
                                        currentTeamId={p.teamId}
                                        teams={teams}
                                        onSelect={(teamId: string | null) => handleAssignTeam(p.id, teamId)}
                                        isLoading={isLoading}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TeamSelector({ currentTeamId, teams, onSelect, isLoading }: any) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const currentTeam = teams.find((t: any) => t.id === currentTeamId)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => !isLoading && setIsOpen(!isOpen)}
                className={cn(
                    "group/btn flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border",
                    isOpen
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-50"
                        : "bg-white border-gray-100 text-gray-500 hover:border-indigo-200 hover:text-indigo-600"
                )}
            >
                <Users className={cn("w-3.5 h-3.5", isOpen ? "text-white" : "text-gray-400 group-hover/btn:text-indigo-500")} />
                <span className="truncate max-w-[90px]">{currentTeam ? 'تعديل الفريق' : 'تعيين فريق'}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-300 opacity-60", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 top-full z-[100] w-52 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] p-2 space-y-1 origin-top-left backdrop-blur-sm"
                    >
                        <div className="px-3 py-1.5 mb-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">تغيير الانتماء</span>
                        </div>

                        <button
                            onClick={() => { onSelect(null); setIsOpen(false); }}
                            className={cn(
                                "w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group",
                                !currentTeamId ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <X className="w-3.5 h-3.5 opacity-40" />
                                بدون فريق
                            </span>
                            {!currentTeamId && <Check className="w-4 h-4" />}
                        </button>

                        <div className="h-px bg-gray-50 mx-2 my-1" />

                        <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                            {teams.map((t: any) => (
                                <button
                                    key={t.id}
                                    onClick={() => { onSelect(t.id); setIsOpen(false); }}
                                    className={cn(
                                        "w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group",
                                        currentTeamId === t.id ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", currentTeamId === t.id ? "bg-indigo-500" : "bg-gray-200 group-hover:bg-indigo-300")} />
                                        {t.name}
                                    </span>
                                    {currentTeamId === t.id && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
