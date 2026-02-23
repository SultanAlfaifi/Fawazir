'use client'

import { useState } from 'react'
import { createTeamManually } from '@/actions/admin'
import { Plus, User, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHARACTER_THEMES, CharacterType } from '@/lib/theme'

export function ManualTeamForm({ dayId, unassignedPlayers }: { dayId: string, unassignedPlayers: any[] }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const togglePlayer = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id))
        } else if (selectedIds.length < 2) {
            setSelectedIds([...selectedIds, id])
        }
    }

    const handleSubmit = async () => {
        if (selectedIds.length === 0) return
        setIsSubmitting(true)
        try {
            await createTeamManually(dayId, selectedIds, `فريق ${Date.now()}`)
            setSelectedIds([])
        } catch (e) {
            console.error(e)
            alert("حدث خطأ أثناء إنشاء الفريق")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (unassignedPlayers.length === 0) return (
        <div className="bg-[#0D0D11] border border-white/5 rounded-[2.5rem] p-12 text-center">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">كل اللاعبين موزعين حالياً ✅</p>
        </div>
    )

    return (
        <div className="bg-[#0D0D11] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-black text-white">توزيع يدوي سريع</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">اختر بطلين لإنشاء فريق تحالف جديد</p>
                </div>
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-3 animate-in zoom-in duration-300">
                        <button
                            onClick={() => setSelectedIds([])}
                            className="p-3 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-transparent hover:border-rose-500/20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 bg-amber-500 text-black rounded-2xl font-black text-xs hover:bg-amber-400 disabled:opacity-50 transition-all active:scale-95 shadow-xl shadow-amber-500/20"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            <span>تأكيد الفريق ({selectedIds.length}/2)</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 gap-2">
                {unassignedPlayers.map(player => {
                    const isSelected = selectedIds.includes(player.id)
                    const theme = CHARACTER_THEMES[player.character as CharacterType] || CHARACTER_THEMES.NAJM
                    const Icon = theme.icon

                    const colorHex = theme.color === 'emerald' ? '#10b981' :
                        theme.color === 'blue' ? '#3b82f6' :
                            theme.color === 'orange' ? '#f97316' :
                                theme.color === 'red' ? '#ef4444' : '#f59e0b'

                    return (
                        <button
                            key={player.id}
                            onClick={() => togglePlayer(player.id)}
                            className={cn(
                                "relative p-2 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 text-center group",
                                isSelected ? "border-transparent" : "bg-white/5 border-white/5 text-gray-500 hover:border-white/10"
                            )}
                            style={isSelected ? { backgroundColor: `${colorHex}15`, borderColor: colorHex, color: colorHex } : {}}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-xl bg-gray-900 border border-white/5 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg",
                            )}
                                style={isSelected ? { backgroundColor: colorHex, color: 'black', border: 'none' } : {}}
                            >
                                {isSelected ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />}
                            </div>
                            <div className="space-y-0.5 w-full">
                                <span className="text-[8px] font-black truncate block w-full text-white">{player.displayName}</span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
