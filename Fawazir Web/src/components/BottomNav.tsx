'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, User as UserIcon, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
    unreadNotifications?: number
}

export function BottomNav({ unreadNotifications = 0 }: BottomNavProps) {
    const pathname = usePathname()

    // Helper to check if link is active
    const isActive = (path: string) => pathname?.startsWith(path)

    return (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-gray-950/95 backdrop-blur-lg border-t border-gray-800 pb-safe md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-around h-16">
                <Link
                    href="/app/overview"
                    className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all group relative ${isActive('/app/overview') ? 'text-amber-500 scale-110' : 'text-gray-500 hover:text-white'}`}
                >
                    <LayoutGrid className={cn("w-5 h-5 transition-transform", isActive('/app/overview') && "fill-amber-500/20")} />
                    <span className="text-[10px] font-black tracking-widest uppercase">الفوز</span>
                </Link>

                <Link
                    href="/app/khair"
                    className="flex-1 flex flex-col items-center justify-center group relative h-full"
                >
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 -translate-y-4 border-4 border-gray-950 rotate-45 group-active:scale-90",
                        isActive('/app/khair')
                            ? "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-[0_10px_30px_rgba(225,29,72,0.4)]"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-rose-400"
                    )}>
                        <div className="-rotate-45">
                            <Heart className={cn("w-6 h-6", isActive('/app/khair') ? "fill-white" : "")} />
                        </div>
                    </div>
                    <span className={cn(
                        "text-[10px] font-black tracking-widest uppercase transition-colors -mt-2",
                        isActive('/app/khair') ? "text-rose-400" : "text-gray-500"
                    )}>الخير</span>
                </Link>

                <Link
                    href="/app/me"
                    className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all group relative ${isActive('/app/me') ? 'text-amber-500 scale-110' : 'text-gray-500 hover:text-white'}`}
                >
                    <div className="relative">
                        <UserIcon className={cn("w-5 h-5 transition-transform", isActive('/app/me') && "fill-amber-500/20")} />
                        {unreadNotifications > 0 && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-gray-950 rounded-full animate-pulse" />
                        )}
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase">أنا</span>
                </Link>
            </div>
        </div>
    )
}
