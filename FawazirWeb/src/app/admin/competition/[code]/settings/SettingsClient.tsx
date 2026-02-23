'use client'

import React, { useState } from 'react'
import { Save, AlertTriangle, Trash2, Key, Info, ShieldAlert, ChevronLeft, Layout } from 'lucide-react'
import { updateCompetitionBasicInfo, updateCompetitionCode, deleteCompetition } from '@/actions/competition-settings'
import { cn } from '@/lib/utils'
import type { Competition } from '@/types'
import { motion } from 'framer-motion'

interface CompetitionSettingsPageProps {
    competition: Competition
}

const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function CompetitionSettingsPage({ competition }: CompetitionSettingsPageProps) {
    const [title, setTitle] = useState(competition.title)
    const [description, setDescription] = useState(competition.description || '')
    const [code, setCode] = useState(competition.code)

    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState('')

    const handleSaveBasic = async () => {
        setIsSaving(true)
        await updateCompetitionBasicInfo(competition.id, { title, description })
        setIsSaving(false)
        // alert('تم حفظ البيانات الأساسية')
    }

    const handleUpdateCode = async () => {
        if (code === competition.code) return
        if (!confirm('تنبيه: تغيير الرمز سيمنع الدخول بالرمز القديم. هل تريد الاستمرار؟')) return

        const res = await updateCompetitionCode(competition.id, code)
        if (res.error) alert(res.error)
        else alert('تم تحديث رمز الدخول بنجاح')
    }

    const handleDelete = async () => {
        if (confirmDelete !== 'حذف المسابقة') return
        if (!confirm('تحذير شديد! سيتم مسح كل شيء نهائياً. هل أنت متأكد؟')) return

        setIsDeleting(true)
        await deleteCompetition(competition.id)
    }

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                show: { transition: { staggerChildren: 0.1 } }
            }}
            className="max-w-4xl mx-auto space-y-8 sm:space-y-10 pb-20"
        >
            {/* Basic Info */}
            <motion.section variants={itemVars} className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 space-y-8 shadow-sm">
                <div className="flex items-center gap-4 justify-end">
                    <div className="text-right">
                        <h3 className="text-xl font-bold text-gray-900">المعلومات الأساسية</h3>
                        <p className="text-xs text-gray-400 font-medium">البيانات التعريفية للمسابقة</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <Layout className="w-6 h-6" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2 text-right">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mr-2 block">اسم المسابقة</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all text-gray-900 text-right"
                        />
                    </div>
                    <div className="space-y-2 text-right">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mr-2 block">وصف المسابقة</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-medium outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none text-gray-900 text-right"
                            placeholder="اكتب وصفاً مختصراً للمسابقة..."
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleSaveBasic}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-70"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                        </button>
                    </div>
                </div>
            </motion.section>

            {/* Join Code */}
            <motion.section variants={itemVars} className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 space-y-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-400/50" />
                <div className="flex items-center gap-4 justify-end relative z-10">
                    <div className="text-right">
                        <h3 className="text-xl font-bold text-gray-900">رمز الانضمام</h3>
                        <p className="text-xs text-gray-400 font-medium">الرمز الذي يستخدمه اللاعبون للدخول</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <Key className="w-6 h-6" />
                    </div>
                </div>

                <div className="flex gap-4 p-5 bg-amber-50/50 rounded-2xl border border-amber-100 text-right">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 border border-amber-100"><AlertTriangle className="w-5 h-5 text-amber-500" /></div>
                    <p className="text-amber-800/80 text-[11px] font-bold leading-relaxed">
                        الرمز الحالي هو <span className="text-amber-600 font-bold px-1.5 py-0.5 bg-white rounded-lg border border-amber-100 mx-1">{competition.code}</span>.
                        سيتم إيقاف الرمز القديم فور تغيير البيانات.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-end gap-4 max-w-lg ml-auto">
                    <div className="w-full flex-1 space-y-2 text-right">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mr-2 block">الرمز الجديد</label>
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-mono font-bold text-2xl tracking-[0.2em] outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-50 text-center text-gray-900"
                        />
                    </div>
                    <button
                        onClick={handleUpdateCode}
                        className="w-full sm:w-fit h-16 px-10 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:bg-black active:scale-95 transition-all shrink-0"
                    >
                        تحديث الرمز
                    </button>
                </div>
            </motion.section>

            {/* Danger Zone */}
            <motion.section variants={itemVars} className="bg-rose-50/20 border border-rose-100 rounded-[2rem] p-8 md:p-12 space-y-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-500/50" />
                <div className="flex items-center gap-4 justify-end relative z-10">
                    <div className="text-right">
                        <h3 className="text-xl font-bold text-rose-900 tracking-tight">منطقة الخطورة</h3>
                        <p className="text-xs text-rose-400 font-medium">إجراءات لا يمكن التراجع عنها</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-5 bg-white border border-rose-100 rounded-2xl text-right">
                        <p className="text-rose-700/80 text-[11px] font-bold leading-relaxed">تنبيه: حذف هذه المسابقة سيؤدي لمسح كافة الإحصائيات والمتسابقين والمحتوى نهائياً من قاعدة البيانات.</p>
                    </div>

                    <div className="space-y-4 text-right">
                        <label className="text-[11px] font-bold text-rose-400 mr-2 block uppercase tracking-widest">لتأكيد الحذف اكتب: (حذف المسابقة)</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-end">
                            <input
                                value={confirmDelete}
                                onChange={(e) => setConfirmDelete(e.target.value)}
                                className="w-full max-w-sm bg-white border border-rose-200 rounded-2xl px-6 py-4 font-bold outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all placeholder:text-rose-100 text-right text-gray-900"
                                placeholder="حذف المسابقة"
                            />
                            <button
                                onClick={handleDelete}
                                disabled={confirmDelete !== 'حذف المسابقة' || isDeleting}
                                className="w-full sm:w-fit flex items-center justify-center gap-2 px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>{isDeleting ? 'جاري الحذف...' : 'حذف نهائي'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.section>
        </motion.div>
    )
}
