'use client'

import { useRef, useState, useEffect } from 'react'
import { Plus, X, Calendar, Loader2 } from 'lucide-react'
import { createDay } from '@/actions/days'
import { useActionState } from 'react'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function AddDayModal({ competitionId, isOpen, onClose }: { competitionId: string, isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-950/20 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl max-w-lg w-full space-y-6 relative z-10"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 text-right">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">إضافة يوم جديد</h3>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">قم بإنشاء تحدي جديد لليوم</p>
                    </div>
                </div>

                <CreateDayForm competitionId={competitionId} onClose={onClose} />
            </motion.div>
        </div>
    )
}

function CreateDayForm({ competitionId, onClose }: { competitionId: string, onClose: () => void }) {
    const [state, action, pending] = useActionState(createDay.bind(null, competitionId), null)
    const [content, setContent] = useState('')

    useEffect(() => {
        if (state?.success) {
            const timer = setTimeout(() => {
                onClose()
            }, 800)
            return () => clearTimeout(timer)
        }
    }, [state?.success, onClose])

    return (
        <form action={action} className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-right">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">رقم اليوم</label>
                    <input
                        name="dayNumber"
                        type="number"
                        min="1"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {state?.errors?.dayNumber && <p className="text-red-500 text-[10px] font-bold mt-1 pr-2">{state.errors.dayNumber[0]}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">موعد الفتح</label>
                    <input
                        name="unlockDate"
                        type="datetime-local"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2 text-right">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">العنوان</label>
                <input
                    name="title"
                    placeholder="مثال: لغز الكنز الرمزي"
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all text-right placeholder:text-gray-300"
                />
                {state?.errors?.title && <p className="text-red-500 text-[10px] font-bold mt-1 pr-2">{state.errors.title[0]}</p>}
            </div>

            <div className="space-y-2 text-right">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">وصف التحدي</label>
                <input type="hidden" name="content" value={content} />
                <div className="rounded-2xl overflow-hidden border border-gray-100 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 transition-all bg-gray-50">
                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="اكتب تفاصيل التحدي أو اللغز هنا..."
                    />
                </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-50">
                {state?.success && (
                    <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-emerald-500 text-xs font-bold ml-auto"
                    >
                        {state.message}
                    </motion.span>
                )}

                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 rounded-2xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                >
                    إلغاء
                </button>

                <button
                    type="submit"
                    disabled={pending}
                    className="relative px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
                >
                    {pending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span>حفظ البيانات</span>
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
