'use client'

import { useActionState, useEffect } from 'react'
import { createCompetition } from '@/actions/competition'
import { Loader2, Sparkles, Wand2, Type, AlignLeft, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function CreateCompetitionForm() {
    const router = useRouter()
    const [state, action, pending] = useActionState(createCompetition, null)

    useEffect(() => {
        if (state?.success && state.code) {
            router.push(`/admin/competition/${state.code}`)
        }
    }, [state, router])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
        >
            <form action={action} className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="space-y-8 relative z-10">
                    {/* Header Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl">
                            🏺
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-black text-gray-500 mr-2 uppercase tracking-widest">
                                <Type className="w-4 h-4" />
                                <span>اسم التحدي</span>
                            </label>
                            <input
                                name="title"
                                autoComplete="off"
                                placeholder="مثلاً: تحدي فوازير 2026"
                                className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-2xl font-black text-xl text-gray-900 placeholder:text-gray-300 focus:bg-white focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300"
                            />
                            {state?.errors?.title && (
                                <motion.p
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-rose-500 text-xs font-bold mr-4"
                                >
                                    {state.errors.title[0]}
                                </motion.p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-black text-gray-500 mr-2 uppercase tracking-widest">
                                <AlignLeft className="w-4 h-4" />
                                <span>الوصف (اختياري)</span>
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="اكتب نبذة تشجيعية للمتسابقين..."
                                className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-2xl font-bold text-gray-700 placeholder:text-gray-300 focus:bg-white focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <AnimatePresence mode="wait">
                            {state?.success ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-center gap-3 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>تم الجرد بنجاح! جاري التوجيه...</span>
                                </motion.div>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={pending}
                                    className="group relative w-full overflow-hidden px-8 py-5 bg-gray-950 text-white rounded-2xl font-black text-lg hover:bg-amber-500 hover:text-gray-950 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    <div className="flex items-center justify-center gap-3 relative z-10">
                                        {pending ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                <span>إنشاء المساحة الآن</span>
                                                <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                    <Sparkles className="absolute -right-4 -top-4 w-12 h-12 text-white/10 group-hover:text-black/5 transition-colors" />
                                </button>
                            )}
                        </AnimatePresence>

                        <p className="text-center text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-[0.2em]">
                            سيتم إنشاء رمز دخول فريد تلقائياً عند الحفظ
                        </p>
                    </div>
                </div>
            </form>
        </motion.div>
    )
}
