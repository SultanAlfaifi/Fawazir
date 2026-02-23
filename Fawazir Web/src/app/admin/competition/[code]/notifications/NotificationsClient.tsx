'use client'

import React, { useState } from 'react'
import { Bell, Send, Info, AlertCircle, Zap, MessageSquare, Clock, CheckCircle } from 'lucide-react'
import { sendAnnouncement } from '@/actions/notifications'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function NotificationsPage({ competitionId }: { competitionId: string }) {
    const [message, setMessage] = useState('')
    const [type, setType] = useState('INFO')
    const [isSending, setIsSending] = useState(false)
    const [sentSuccessfully, setSentSuccessfully] = useState(false)

    const handleSend = async () => {
        if (!message) return
        setIsSending(true)
        await sendAnnouncement(competitionId, message, type)
        setIsSending(false)
        setMessage('')
        setSentSuccessfully(true)
        setTimeout(() => setSentSuccessfully(false), 3000)
    }

    const containerVars = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVars = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVars}
            className="max-w-4xl mx-auto space-y-10 pb-20"
        >
            {/* Form Card */}
            <motion.div variants={itemVars} className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-sm space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                <div className="flex items-center gap-4 justify-end relative z-10">
                    <div className="text-right">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">إرسال إعلان عام</h3>
                        <p className="text-xs text-gray-400 font-medium">سيصل التنبيه لجميع المتسابقين في المسابقة</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <Bell className="w-6 h-6" />
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    <div className="space-y-2 text-right">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mr-2 block">نص الرسالة</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-6 font-medium outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none text-right text-base text-gray-900"
                            placeholder="اكتب هنا الرسالة التي تريد إيصالها للجميع..."
                        />
                    </div>

                    <div className="space-y-3 text-right">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mr-2 block">نوع التنبيه</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <TypeButton active={type === 'INFO'} onClick={() => setType('INFO')} icon={<Info className="w-4 h-4" />} label="إحصائية" color="indigo" />
                            <TypeButton active={type === 'ALERT'} onClick={() => setType('ALERT')} icon={<AlertCircle className="w-4 h-4" />} label="مهم جداً" color="amber" />
                            <TypeButton active={type === 'URGENT'} onClick={() => setType('URGENT')} icon={<Zap className="w-4 h-4" />} label="تحدي عاجل" color="rose" />
                            <TypeButton active={type === 'CHAT'} onClick={() => setType('CHAT')} icon={<MessageSquare className="w-4 h-4" />} label="رسالة عامة" color="emerald" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <AnimatePresence>
                            {sentSuccessfully && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 text-emerald-600 font-bold text-sm ml-auto"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    تم إرسال الإشعار بنجاح
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleSend}
                            disabled={isSending || !message}
                            className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale ml-auto"
                        >
                            <span>{isSending ? 'جاري الإرسال...' : 'إرسال الإعلان اﻵن'}</span>
                            <Send className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* History Preview */}
            <motion.div variants={itemVars} className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400"><Clock className="w-5 h-5" /></div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">سجل الإشعارات</h3>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="p-5 bg-white border border-gray-100 rounded-3xl flex items-center justify-between group hover:border-indigo-100 transition-all">
                        <div className="flex items-center gap-4 text-right">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-100"><Info className="w-5 h-5" /></div>
                            <div>
                                <p className="text-base font-bold text-gray-900 line-clamp-1">مرحباً بكل المنضمين الجدد لمسابقتنا</p>
                                <p className="text-[11px] text-gray-400 font-medium">قبل قليل</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 shrink-0">تم التوصيل</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

type TypeButtonColor = 'indigo' | 'amber' | 'rose' | 'emerald'

interface TypeButtonProps {
    active: boolean
    onClick: () => void
    icon: React.ReactElement
    label: string
    color: TypeButtonColor
}

function TypeButton({ active, onClick, icon, label, color }: TypeButtonProps) {
    const variants = {
        indigo: active ? "bg-indigo-50 text-indigo-600 border-indigo-200 ring-4 ring-indigo-50" : "bg-white text-gray-400 border-gray-100 hover:border-indigo-100",
        amber: active ? "bg-amber-50 text-amber-600 border-amber-200 ring-4 ring-amber-50" : "bg-white text-gray-400 border-gray-100 hover:border-amber-100",
        rose: active ? "bg-rose-50 text-rose-600 border-rose-200 ring-4 ring-rose-50" : "bg-white text-gray-400 border-gray-100 hover:border-rose-100",
        emerald: active ? "bg-emerald-50 text-emerald-600 border-emerald-200 ring-4 ring-emerald-50" : "bg-white text-gray-400 border-gray-100 hover:border-emerald-100",
    }
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "px-4 py-4 rounded-2xl text-xs font-bold border flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-sm",
                variants[color]
            )}
        >
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-colors", active ? "bg-white/50" : "bg-gray-50")}>
                {icon}
            </div>
            {label}
        </button>
    )
}
