'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import {
    LayoutGrid,
    Plus,
    LogOut,
    Menu,
    X,
    Shield,
    ChevronLeft,
    ArrowRight,
    LayoutDashboard,
    Calendar,
    BarChart2,
    Bell,
    Settings,
    User,
    Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/actions/auth'
import { motion, AnimatePresence } from 'framer-motion'

const ICON_MAP: Record<string, LucideIcon> = {
    'LayoutGrid': LayoutGrid,
    'Plus': Plus,
    'LayoutDashboard': LayoutDashboard,
    'Calendar': Calendar,
    'BarChart2': BarChart2,
    'Bell': Bell,
    'Settings': Settings,
}

interface AdminShellProps {
    children: React.ReactNode
    session: any
    customNavItems?: { name: string, icon: string, href: string }[]
    title?: string
    subtitle?: string
    backHref?: string
}

export default function AdminShell({ children, session, customNavItems, title, subtitle, backHref }: AdminShellProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const pathname = usePathname()
    const router = useRouter()

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    const handleLogout = () => {
        startTransition(async () => {
            await logout()
        })
    }

    const handleNavigate = (href: string) => {
        if (pathname === href) {
            setIsMenuOpen(false)
            return
        }
        startTransition(() => {
            router.push(href)
        })
    }

    const defaultNavItems = [
        { name: 'المسابقات', icon: 'LayoutGrid', href: '/admin/competitions' },
        { name: 'مسابقة جديدة', icon: 'Plus', href: '/admin/competitions/create' },
        { name: 'إعدادات الحساب', icon: 'Settings', href: '/admin/settings/account' },
    ]

    const navItems = customNavItems || defaultNavItems
    const displayTitle = title || "لوحة الإشراف"
    const displaySubtitle = subtitle || "Fawazir 2026"

    return (
        <div className="min-h-screen bg-[#FAFBFC] text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden" dir="rtl">
            {/* --- Progressive Loading Bar --- */}
            <AnimatePresence>
                {isPending && (
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-l from-indigo-500 via-amber-400 to-indigo-600 z-[1000] origin-right"
                    />
                )}
            </AnimatePresence>

            {/* --- Global Header --- */}
            <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100/80 px-4 lg:px-6 py-4 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] transition-all">
                <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(true)}
                        className="lg:hidden p-2.5 text-gray-500 bg-gray-50 rounded-xl border border-gray-100/80 active:scale-95 transition-all hover:bg-gray-100 shrink-0"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 min-w-0">
                        {backHref && (
                            <button
                                onClick={() => handleNavigate(backHref)}
                                className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors lg:hidden shrink-0"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={() => handleNavigate('/admin/competitions')}
                            className="flex items-center gap-2 sm:gap-3.5 group shrink-0 text-right"
                        >
                            <div className={cn(
                                "w-10 h-10 lg:w-9 lg:h-9 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shrink-0",
                                customNavItems ? "bg-indigo-600 shadow-indigo-600/10" : "bg-gray-950 shadow-gray-950/10"
                            )}>
                                {customNavItems ? <span className="font-bold text-base lg:text-lg">F</span> : <Shield className="w-4 h-4 lg:w-5 lg:h-5" />}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-bold text-lg tracking-tight leading-none text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">{displayTitle}</span>
                                <span className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest leading-none hidden sm:block opacity-60 truncate">{displaySubtitle}</span>
                            </div>
                        </button>
                    </div>

                    {/* Desktop Nav Items - Intelligent Wrapping */}
                    <div className="hidden lg:flex items-center flex-1 min-w-0 mx-2 border-r border-gray-100/80 pr-2 overflow-hidden">
                        <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap py-1">
                            {backHref && (
                                <button
                                    onClick={() => handleNavigate(backHref)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-900 transition-all shrink-0"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                    <span>العودة</span>
                                </button>
                            )}
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                const Icon = ICON_MAP[item.icon] || Shield
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => handleNavigate(item.href)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-2 rounded-xl lg:rounded-2xl text-[12px] xl:text-[13px] font-bold transition-all duration-200 shrink-0",
                                            isActive
                                                ? (customNavItems ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10" : "bg-gray-950 text-white shadow-lg shadow-gray-900/10")
                                                : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                                        )}
                                    >
                                        <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />
                                        <span className="truncate">{item.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 shrink-0 mr-4">
                    <div className="hidden xl:flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-900 leading-none truncate max-w-[120px]">مرحباً، {session.displayName}</span>
                        <span className="text-[10px] font-bold text-emerald-600 mt-1.5 uppercase tracking-widest leading-none">مشرف معتمد</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isPending}
                            className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden xl:inline">{isPending ? '..' : 'خروج'}</span>
                        </button>

                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm overflow-hidden shrink-0">
                            {session.displayName?.[0] ? (
                                <span className="font-bold text-sm uppercase">{session.displayName[0]}</span>
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- Mobile Sidebar Overlay --- */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-950/20 backdrop-blur-sm z-[150] lg:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* --- Mobile Sidebar --- */}
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-[100dvh] w-[85%] sm:w-80 bg-white z-[200] shadow-2xl flex flex-col lg:hidden border-l border-gray-100 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-50 h-24 shrink-0" dir="rtl">
                                <div className="flex items-center gap-3.5">
                                    <div className={cn(
                                        "w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl font-bold text-lg",
                                        customNavItems ? "bg-indigo-600 shadow-indigo-600/10" : "bg-gray-950 shadow-gray-950/10"
                                    )}>
                                        F
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 tracking-tight leading-none text-right text-lg">{displayTitle}</span>
                                        <span className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest leading-none text-right opacity-60">{displaySubtitle}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all active:scale-90 shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 py-8 pb-10" dir="rtl">
                                <div className="space-y-2">
                                    <div className="px-5 pb-3 text-right">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">القائمة الأساسية</span>
                                    </div>
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href
                                        const Icon = ICON_MAP[item.icon] || Shield
                                        return (
                                            <button
                                                key={item.href}
                                                onClick={() => handleNavigate(item.href)}
                                                disabled={isPending}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-5 py-5 rounded-[1.5rem] transition-all group relative overflow-hidden text-right mb-1",
                                                    isActive
                                                        ? (customNavItems ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/10" : "bg-gray-950 text-white shadow-xl shadow-gray-900/10")
                                                        : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                                                )}
                                            >
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                        isActive ? "bg-white/10" : "bg-gray-100 group-hover:bg-gray-200"
                                                    )}>
                                                        {isPending && isActive ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900")} />
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-[15px] tracking-tight">{item.name}</span>
                                                </div>
                                                <ChevronLeft className={cn("w-5 h-5 transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 border border-current/20 rounded-lg p-1 shrink-0", isActive ? "opacity-100 translate-x-0" : "")} />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* User Section at bottom - Account for Safe Areas */}
                            <div className="p-8 border-t border-gray-50 bg-gray-50/50 pb-safe-offset-4 shrink-0 mt-auto" dir="rtl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-900 font-bold text-2xl shadow-sm">
                                        {session.displayName?.[0] || 'A'}
                                    </div>
                                    <div className="flex-1 min-w-0 text-right">
                                        <p className="text-[15px] font-bold text-gray-900 truncate">{session.displayName}</p>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1 opacity-80">مشرف معتمد</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={isPending}
                                    className="flex items-center justify-center gap-3 w-full py-4.5 rounded-2xl bg-rose-50/50 text-rose-600 font-bold text-[15px] hover:bg-rose-500 hover:text-white transition-all active:scale-[0.98] border border-rose-100 disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                                    <span>{isPending ? 'جاري الخروج...' : 'تسجيل الخروج'}</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <main className="p-4 sm:p-8 max-w-6xl mx-auto min-h-[calc(100vh-80px)]">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    )
}


