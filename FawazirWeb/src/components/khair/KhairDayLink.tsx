'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CheckCircle2, Sparkles, Loader2 } from 'lucide-react'

interface KhairDayLinkProps {
    dayNumber: number
    isDone: boolean
    points?: number
    isOpen: boolean
}

export function KhairDayLink({ dayNumber, isDone, points, isOpen }: KhairDayLinkProps) {
    const [isNavigating, setIsNavigating] = useState(false)

    if (!isOpen) {
        return (
            <div className="relative aspect-square rounded-[1.5rem] bg-white/20 border border-white/30 flex flex-col items-center justify-center grayscale opacity-40">
                <span className="absolute top-2 right-3 text-[9px] font-black text-[#0C4A6E]/40">{dayNumber}</span>
                <Sparkles className="w-5 h-5 text-[#0C4A6E]/30" />
            </div>
        )
    }

    return (
        <Link
            href={`/app/khair/${dayNumber}`}
            onClick={() => setIsNavigating(true)}
            className={cn(
                "relative aspect-square rounded-[1.5rem] border-2 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 group shadow-lg overflow-hidden",
                isDone
                    ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20"
                    : "bg-white/80 backdrop-blur-sm border-white hover:border-sky-400 text-[#0C4A6E]"
            )}
        >
            {/* Loading Overlay */}
            {isNavigating && (
                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                </div>
            )}

            <span className={cn(
                "absolute top-2 right-3 text-[9px] font-black",
                isDone ? "text-white/60" : "text-[#0369A1]/40 group-hover:text-sky-600"
            )}>{dayNumber}</span>

            {isDone ? (
                <CheckCircle2 className="w-6 h-6 text-white" />
            ) : (
                <Sparkles className="w-5 h-5 text-sky-300 group-hover:text-sky-500 opacity-50" />
            )}

            {isDone && (
                <div className="absolute bottom-2 font-black text-[10px] text-white">
                    +{points}
                </div>
            )}
        </Link>
    )
}
