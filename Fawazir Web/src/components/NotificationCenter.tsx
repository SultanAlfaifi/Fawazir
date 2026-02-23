'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, Check, Inbox, Loader2, Sparkles, Info, AlertCircle, Zap, MessageSquare } from 'lucide-react'
import { getUserNotifications, markAsRead, markAllAsRead } from '@/actions/notifications'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Notification {
    id: string
    message: string
    read: boolean
    createdAt: Date
    type: string
}

export function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const fetchNotifications = async () => {
        try {
            const data = await getUserNotifications()
            // Map plain objects from server action
            const mapped = (data as any[]).map(n => ({
                ...n,
                createdAt: new Date(n.createdAt)
            }))
            setNotifications(mapped)
            setUnreadCount(mapped.filter(n => !n.read).length)
        } catch (err) {
            console.error('Failed to fetch notifications:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
        // Poll every 2 minutes for new notifications
        const interval = setInterval(fetchNotifications, 120000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMarkAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
        await markAsRead(id)
    }

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
        await markAllAsRead()
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative p-2 rounded-xl transition-all duration-300",
                    isOpen ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                )}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                        {unreadCount > 9 ? '+9' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 mt-3 w-80 md:w-96 bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200/50 overflow-hidden z-[100]"
                    >
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <h3 className="font-black text-gray-900 tracking-tight">التنبيهات</h3>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest px-3 py-1 bg-white border border-indigo-100 rounded-lg shadow-sm transition-all"
                                >
                                    قراءة الكل
                                </button>
                            )}
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="py-20 flex flex-center flex-col items-center gap-4 text-gray-400">
                                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">جاري التحميل...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="py-20 flex flex-col items-center gap-4 text-gray-400">
                                    <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center">
                                        <Inbox className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] font-black text-gray-950 uppercase tracking-widest">لا توجد إشعارات</p>
                                        <p className="text-[9px] font-bold text-gray-400 mt-1">سجل التنبيهات فارغ حالياً</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((n) => {
                                        const typeConfig = n.type === 'ALERT' ? {
                                            icon: <AlertCircle className="w-5 h-5" />,
                                            color: 'text-amber-600 bg-amber-50 border-amber-100',
                                            unreadBg: 'bg-amber-50/10',
                                            accent: 'bg-amber-500',
                                            label: 'مهم جداً'
                                        } : n.type === 'URGENT' ? {
                                            icon: <Zap className="w-5 h-5" />,
                                            color: 'text-rose-600 bg-rose-50 border-rose-100',
                                            unreadBg: 'bg-rose-50/10',
                                            accent: 'bg-rose-500',
                                            label: 'تحدي عاجل'
                                        } : n.type === 'CHAT' ? {
                                            icon: <MessageSquare className="w-5 h-5" />,
                                            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                                            unreadBg: 'bg-emerald-50/10',
                                            accent: 'bg-emerald-500',
                                            label: 'رسالة عامة'
                                        } : {
                                            icon: <Info className="w-5 h-5" />,
                                            color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
                                            unreadBg: 'bg-indigo-50/10',
                                            accent: 'bg-indigo-500',
                                            label: 'إحصائية'
                                        };

                                        return (
                                            <div
                                                key={n.id}
                                                onClick={() => !n.read && handleMarkAsRead(n.id)}
                                                className={cn(
                                                    "p-5 cursor-pointer transition-all hover:bg-gray-50 flex gap-4 items-start relative group font-sans",
                                                    !n.read ? typeConfig.unreadBg : ""
                                                )}
                                            >
                                                {!n.read && (
                                                    <div className={cn("absolute right-0 top-0 bottom-0 w-1 rounded-l-full", typeConfig.accent)} />
                                                )}

                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border transition-all",
                                                    !n.read
                                                        ? cn("bg-white shadow-sm", typeConfig.color)
                                                        : "bg-gray-50 text-gray-300 border-gray-100"
                                                )}>
                                                    {typeConfig.icon}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={cn(
                                                            "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                                            !n.read ? typeConfig.color : "text-gray-400 bg-gray-100"
                                                        )}>
                                                            {typeConfig.label}
                                                        </span>
                                                    </div>
                                                    <p className={cn(
                                                        "text-[13px] leading-relaxed break-words",
                                                        !n.read ? "text-gray-900 font-bold" : "text-gray-500 font-medium"
                                                    )}>
                                                        {n.message}
                                                    </p>
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 block">
                                                        {n.createdAt.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })} • {n.createdAt.toLocaleDateString('ar-SA')}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
