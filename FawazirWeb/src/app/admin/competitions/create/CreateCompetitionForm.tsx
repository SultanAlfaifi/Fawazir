'use client'

import { useActionState } from 'react'
import { createCompetition } from '@/actions/competition'
import { Loader2, Plus, Sparkles } from 'lucide-react'

export function CreateCompetitionForm() {
    const [state, action, pending] = useActionState(createCompetition, null)

    return (
        <form action={action} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl max-w-2xl mx-auto space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">عنوان المسابقة</label>
                    <input
                        name="title"
                        placeholder="مثال: تحدي رمضان 2026"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    {state?.errors?.title && <p className="text-red-500 text-xs font-bold">{state.errors.title[0]}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">الوصف (اختياري)</label>
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="نبذة عن التحدي..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                    />
                    {state?.errors?.description && <p className="text-red-500 text-xs font-bold">{state.errors.description[0]}</p>}
                </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-4">
                {state?.success && <span className="text-emerald-500 text-sm font-bold">{state.message}</span>}
                <button
                    type="submit"
                    disabled={pending}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-900/10 disabled:opacity-70"
                >
                    {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>إنشاء المسابقة</span><Plus className="w-5 h-5" /></>}
                </button>
            </div>
        </form>
    )
}
