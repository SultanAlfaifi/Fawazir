'use client'

import { useActionState, useEffect } from 'react'
import { joinCompetition } from '@/actions/competition'
import { Loader2, Plus, ArrowLeft, ArrowRight, Magnet, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function JoinCompetitionForm() {
    const [state, action, pending] = useActionState(joinCompetition, null)

    return (
        <form action={action} className="relative group/form">
            <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white border-2 border-gray-100 rounded-[2rem] focus-within:border-indigo-500 focus-within:shadow-xl transition-all duration-300">
                <input
                    name="code"
                    type="text"
                    maxLength={8}
                    className="w-full sm:w-48 bg-transparent border-none outline-none px-6 py-4 font-mono font-black text-lg tracking-[0.2em] text-center uppercase placeholder-gray-300 text-gray-900"
                    placeholder="CODE"
                    required
                />
                <button
                    type="submit"
                    disabled={pending}
                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95 shrink-0"
                >
                    {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            <span>انضم</span>
                            <Plus className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>

            <AnimatePresence>
                {state?.errors?.code && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -bottom-10 inset-x-0 text-center text-[10px] font-black text-rose-500 uppercase tracking-widest"
                    >
                        {state.errors.code}
                    </motion.div>
                )}
                {state?.success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -bottom-10 inset-x-0 text-center text-[10px] font-black text-emerald-500 uppercase tracking-widest"
                    >
                        تم الانضمام بنجاح!
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    )
}
