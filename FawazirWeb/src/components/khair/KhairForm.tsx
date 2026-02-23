'use client'

import { useState } from 'react'
import { saveKhairEntry } from '@/actions/khair'
import { Check, Plus, X, Star, Book, Heart, MessageSquare, Loader2, Sparkles, ChevronRight, Leaf, CloudSun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface KhairFormProps {
    dayNumber: number
    initialData: {
        completedJuz: number[]
        completedHadith: number[]
        charityDeeds: string[]
        charityScore: number
    }
    allCompletedJuz: number[]
    allCompletedHadiths: number[]
}

const CHARITY_SUGGESTIONS = [
    "إماطة الأذى عن الطريق",
    "إدخال السرور على قلب مسلم",
    "سقيا ماء",
    "التبسم في وجه أخيك",
    "إعانة محتاج",
    "الصدقة بمال",
    "بر الوالدين (خدمة خاصة)",
    "إفطار صائم"
]

export function KhairForm({ dayNumber, initialData, allCompletedJuz, allCompletedHadiths }: KhairFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [completedJuz, setCompletedJuz] = useState<number[]>(initialData.completedJuz)
    const [completedHadith, setCompletedHadith] = useState<number[]>(initialData.completedHadith)
    const [charityDeeds, setCharityDeeds] = useState<string[]>(initialData.charityDeeds.length > 0 ? initialData.charityDeeds : [""])

    async function handleSave() {
        setIsLoading(true)
        try {
            await saveKhairEntry({
                dayNumber,
                completedJuz,
                completedHadith,
                charityDeeds: charityDeeds.filter(d => d.trim() !== '')
            })
            router.push('/app/khair')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('حدث خطأ أثناء الحفظ')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleJuz = (j: number) => {
        setCompletedJuz(prev => prev.includes(j) ? prev.filter(x => x !== j) : [...prev, j])
    }

    const toggleHadith = (h: number) => {
        setCompletedHadith(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h])
    }

    const updateDeed = (idx: number, val: string) => {
        const newDeeds = [...charityDeeds]
        newDeeds[idx] = val
        setCharityDeeds(newDeeds)
    }

    const addDeed = () => setCharityDeeds([...charityDeeds, ""])
    const removeDeed = (idx: number) => setCharityDeeds(charityDeeds.filter((_, i) => i !== idx))

    return (
        <div className="min-h-screen bg-[#F0F9FF] p-6 pb-40 space-y-10" dir="rtl">
            {/* Header - Eco Morning Style */}
            <div className="flex items-center gap-6">
                <button
                    onClick={() => router.back()}
                    className="w-14 h-14 rounded-3xl bg-white shadow-xl flex items-center justify-center text-[#0C4A6E] hover:scale-105 active:scale-95 transition-all border-2 border-white"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <CloudSun className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tighter">إنجازات اليوم {dayNumber}</h2>
                    </div>
                    <p className="text-[#0369A1] font-bold text-sm">سجل أعمالك وارتكِ في ميزان حسناتك</p>
                </div>
            </div>

            {/* Quran Section - Green Theme */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-3">
                    <h3 className="flex items-center gap-4 font-black text-[#0C4A6E] text-xl">
                        <div className="p-3 bg-emerald-500 rounded-[1.25rem] shadow-lg shadow-emerald-500/20">
                            <Book className="w-6 h-6 text-white" />
                        </div>
                        ختم القرآن الكريم
                    </h3>
                    <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                        +١٠٠ نقطة للجزء
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-10 border-4 border-white shadow-2xl shadow-emerald-900/5">
                    <p className="text-sm text-[#065F46] mb-8 font-black text-center opacity-60">اضغط على الأجزاء التي أتممت قراءتها اليوم</p>
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(j => (
                            <button
                                key={j}
                                onClick={() => toggleJuz(j)}
                                className={cn(
                                    "aspect-square rounded-2xl border-2 flex items-center justify-center font-black text-lg transition-all active:scale-90",
                                    completedJuz.includes(j)
                                        ? "bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/30 -translate-y-1"
                                        : allCompletedJuz.includes(j)
                                            ? "bg-slate-100 border-slate-200 text-slate-300 opacity-40 cursor-not-allowed"
                                            : "bg-white border-[#E2E8F0] text-[#1E293B] hover:border-emerald-400 hover:text-emerald-600 shadow-sm"
                                )}
                            >
                                {j}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hadith Section - Sky Theme */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-3">
                    <h3 className="flex items-center gap-4 font-black text-[#0C4A6E] text-xl">
                        <div className="p-3 bg-[#0EA5E9] rounded-[1.25rem] shadow-lg shadow-sky-500/20">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        الأربعين النووية
                    </h3>
                    <div className="bg-sky-100 text-sky-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-200">
                        +٥٠ نقطة للحديث
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-10 border-4 border-white shadow-2xl shadow-sky-900/5">
                    <p className="text-sm text-[#0369A1] mb-8 font-black text-center opacity-60">ما هي الأحاديث التي قرأتها أو حفظتها اليوم؟</p>
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4">
                        {Array.from({ length: 42 }, (_, i) => i + 1).map(h => (
                            <button
                                key={h}
                                onClick={() => toggleHadith(h)}
                                className={cn(
                                    "aspect-square rounded-2xl border-2 flex items-center justify-center font-black text-lg transition-all active:scale-90",
                                    completedHadith.includes(h)
                                        ? "bg-sky-500 border-sky-400 text-white shadow-xl shadow-sky-500/30 -translate-y-1"
                                        : allCompletedHadiths.includes(h)
                                            ? "bg-slate-100 border-slate-200 text-slate-300 opacity-40 cursor-not-allowed"
                                            : "bg-white border-[#E2E8F0] text-[#1E293B] hover:border-sky-400 hover:text-sky-600 shadow-sm"
                                )}
                            >
                                {h}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Charity Section - Fresh Theme */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-3">
                    <h3 className="flex items-center gap-4 font-black text-[#0C4A6E] text-xl">
                        <div className="p-3 bg-amber-500 rounded-[1.25rem] shadow-lg shadow-amber-500/20">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        أعمال البر والخير
                    </h3>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-amber-200">تقييم المشرف</span>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-[3.5rem] p-10 border-4 border-white shadow-2xl shadow-[#0C4A6E]/5 space-y-10">
                    <div className="space-y-6">
                        {charityDeeds.map((deed, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="flex-1 relative group">
                                    <input
                                        type="text"
                                        value={deed}
                                        onChange={(e) => updateDeed(idx, e.target.value)}
                                        placeholder="ما هو العمل الصالح الذي قمت به؟"
                                        className="w-full bg-[#F8FAFC] border-2 border-[#F1F5F9] rounded-[2rem] px-8 py-5 text-base font-bold text-[#0F172A] focus:outline-none focus:border-[#BAE6FD] focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
                                    />
                                    {deed && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500"><Check className="w-5 h-5" /></div>}
                                </div>
                                {charityDeeds.length > 1 && (
                                    <button
                                        onClick={() => removeDeed(idx)}
                                        className="w-16 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 active:scale-90 transition-all border border-rose-100"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            onClick={addDeed}
                            className="w-full py-5 rounded-[2rem] border-2 border-dashed border-[#CBD5E1] text-[#64748B] text-sm font-black flex items-center justify-center gap-3 hover:bg-white hover:border-[#BAE6FD] hover:text-[#0369A1] transition-all"
                        >
                            <Plus className="w-6 h-6" />
                            <span>إضافة عمل صالح آخر</span>
                        </button>
                    </div>

                    <div className="pt-8 border-t border-slate-100 space-y-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-sky-400" />
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">اقتراحات ملهمة اليوم</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {CHARITY_SUGGESTIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => {
                                        if (charityDeeds[charityDeeds.length - 1] === "") {
                                            updateDeed(charityDeeds.length - 1, s)
                                        } else {
                                            setCharityDeeds([...charityDeeds, s])
                                        }
                                    }}
                                    className="px-6 py-3 bg-white border-2 border-[#F1F5F9] rounded-2xl text-sm text-[#334155] font-black hover:border-sky-300 hover:text-sky-600 transition-all shadow-sm active:scale-95"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-24 inset-x-8 z-50">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-[2.5rem]" />
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="relative w-full h-20 bg-[#0C4A6E] hover:bg-[#075985] text-white font-black text-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(12,74,110,0.4)] flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 group"
                >
                    {isLoading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                        <>
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <Check className="w-6 h-6 text-emerald-400" strokeWidth={4} />
                            </div>
                            <span>تأكيد الإنجازات وحفظ السجل</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
