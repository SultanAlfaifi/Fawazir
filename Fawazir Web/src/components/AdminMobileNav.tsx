'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Calendar, Layers, Activity, Bell, Settings, LogOut, Menu, X, Heart, Shield } from 'lucide-react'
import { logout } from '@/actions/auth'
import { cn } from '@/lib/utils'

export function AdminMobileNav() {
    const [isOpen, setIsOpen] = useState(false)

    const navItems = [
        { href: '/admin', icon: LayoutDashboard, label: 'الرئيسية' },
        { href: '/admin/days', icon: Calendar, label: 'إدارة المحتوى' },
        { href: '/admin/khair', icon: Heart, label: 'لوحة الخير', highlight: true },
        { href: '/admin/tasks', icon: Layers, label: 'المهام اليومية' },
        { href: '/admin/progress', icon: Activity, label: 'التقدم' },
        { href: '/admin/notifications', icon: Bell, label: 'الإشعارات' },
        { href: '/admin/settings', icon: Settings, label: 'الإعدادات' },
    ]

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden bg-[#0A0A0E] border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="font-black text-white text-sm tracking-tight">بوابة سلطان</h1>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-md"
                        />

                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-80 bg-[#0A0A0E] border-l border-white/5 z-50 lg:hidden flex flex-col shadow-3xl"
                        >
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-black text-amber-500">القائمة</h2>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">فوازير ٢٠٢٦</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-hide bg-gradient-to-b from-black/20 to-transparent">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-sm",
                                            item.highlight
                                                ? "text-amber-500 bg-amber-500/5 border border-amber-500/10"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5 opacity-70" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="p-6 border-t border-white/5 bg-black/20">
                                <button
                                    onClick={() => logout()}
                                    className="flex items-center gap-4 w-full p-4 text-rose-500 hover:bg-rose-500/5 rounded-2xl font-black text-sm transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>تسجيل الخروج</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
