'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Target, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
    value: string // YYYY-MM-DD
    onChange: (value: string) => void
    label?: string
}

export function PremiumDatePicker({ value, onChange, label }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<'gregorian' | 'hijri'>('hijri')
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date())
    const containerRef = useRef<HTMLDivElement>(null)

    // Sync viewDate when value changes from outside
    useEffect(() => {
        if (value) {
            const d = new Date(value)
            if (!isNaN(d.getTime())) setViewDate(d)
        }
    }, [value])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedDate = useMemo(() => {
        if (!value) return null
        const d = new Date(value)
        return isNaN(d.getTime()) ? null : d
    }, [value])

    const getHijriParts = (date: Date) => {
        const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        })
        const parts = fmt.formatToParts(date)
        return {
            day: parseInt(parts.find(p => p.type === 'day')?.value || '1'),
            month: parseInt(parts.find(p => p.type === 'month')?.value || '1'),
            year: parseInt(parts.find(p => p.type === 'year')?.value || '1447')
        }
    }

    const formatLongHijri = (date: Date) => {
        return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
    }

    const formatLongGregorian = (date: Date) => {
        return new Intl.DateTimeFormat('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
    }

    const calendarData = useMemo(() => {
        if (mode === 'gregorian') {
            const year = viewDate.getFullYear()
            const month = viewDate.getMonth()
            const firstOfMonth = new Date(year, month, 1)
            const startDay = firstOfMonth.getDay()
            const daysInMonth = new Date(year, month + 1, 0).getDate()

            const days = []
            for (let i = 0; i < startDay; i++) days.push(null)
            for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))

            return {
                title: new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(viewDate),
                days,
                next: () => setViewDate(new Date(year, month + 1, 1)),
                prev: () => setViewDate(new Date(year, month - 1, 1))
            }
        } else {
            const h = getHijriParts(viewDate)
            let start = new Date(viewDate)
            start.setDate(start.getDate() - (h.day - 1))
            while (getHijriParts(start).day !== 1) {
                if (getHijriParts(start).day > 1) start.setDate(start.getDate() - 1)
                else start.setDate(start.getDate() + 1)
            }

            const startDayOfWeek = start.getDay()
            const currentMonth = h.month
            const days = []
            for (let i = 0; i < startDayOfWeek; i++) days.push(null)
            let curr = new Date(start)
            while (getHijriParts(curr).month === currentMonth) {
                days.push(new Date(curr))
                curr.setDate(curr.getDate() + 1)
            }

            return {
                title: new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { month: 'long', year: 'numeric' }).format(viewDate),
                days,
                next: () => {
                    const next = new Date(start)
                    next.setDate(next.getDate() + 31)
                    setViewDate(next)
                },
                prev: () => {
                    const prev = new Date(start)
                    prev.setDate(prev.getDate() - 2)
                    setViewDate(prev)
                }
            }
        }
    }, [viewDate, mode])

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative group cursor-pointer bg-white border rounded-2xl p-3 px-4 flex items-center justify-between transition-all duration-300",
                    isOpen ? "border-indigo-500 shadow-lg ring-4 ring-indigo-50" : "border-gray-100 hover:border-gray-200"
                )}
            >
                <div className="text-right flex-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 block leading-none">{label || 'تاريخ الانطلاق'}</span>
                    <div className="flex items-center gap-2 justify-end">
                        <span className="text-sm font-bold text-gray-900 leading-none">
                            {selectedDate ? (mode === 'hijri' ? formatLongHijri(selectedDate) : formatLongGregorian(selectedDate)) : 'اختر التاريخ'}
                        </span>
                        {!selectedDate && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                    </div>
                </div>

                <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300",
                    isOpen ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                )}>
                    <CalendarIcon className="w-4 h-4" />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Mobile Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
                        />

                        {/* Calendar Body */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 30,
                                scale: typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 0.9,
                                filter: 'blur(10px)'
                            }}
                            animate={{
                                opacity: 1,
                                y: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 15,
                                scale: 1,
                                filter: 'blur(0px)'
                            }}
                            exit={{
                                opacity: 0,
                                y: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 20,
                                scale: typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 0.95,
                                filter: 'blur(10px)'
                            }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={cn(
                                "z-[100] bg-white overflow-hidden text-right rtl",
                                // Mobile styles: Bottom Sheet
                                "fixed inset-x-0 bottom-0 rounded-t-[3rem] p-8 md:p-8",
                                // Desktop styles: Popover
                                "md:absolute md:top-full md:bottom-auto md:right-0 md:w-[400px] md:rounded-[3.5rem] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] md:border md:border-gray-100"
                            )}
                        >
                            {/* Mobile Handle */}
                            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />

                            {/* Glassmorphism Background Decor */}
                            <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10">
                                {/* Header actions for mobile */}
                                <div className="flex md:hidden items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-gray-900">{label || 'اختيار التاريخ'}</h2>
                                    <button onClick={() => setIsOpen(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400"><X className="w-5 h-5" /></button>
                                </div>

                                {/* Mode Switcher */}
                                <div className="grid grid-cols-2 bg-gray-50 p-1.5 rounded-[2rem] mb-8 relative overflow-hidden text-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setMode('hijri'); }}
                                        className={cn(
                                            "relative py-3.5 text-xs font-black transition-colors tracking-widest uppercase rounded-[1.5rem]",
                                            mode === 'hijri' ? "text-white" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        {mode === 'hijri' && (
                                            <motion.div layoutId="premiumTogglePill" className="absolute inset-0 bg-gray-900 rounded-[1.5rem] shadow-xl" transition={{ type: "spring", bounce: 0.1, duration: 0.5 }} />
                                        )}
                                        <span className="relative z-10">هجري</span>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setMode('gregorian'); }}
                                        className={cn(
                                            "relative py-3.5 text-xs font-black transition-colors tracking-widest uppercase rounded-[1.5rem]",
                                            mode === 'gregorian' ? "text-white" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        {mode === 'gregorian' && (
                                            <motion.div layoutId="premiumTogglePill" className="absolute inset-0 bg-gray-900 rounded-[1.5rem] shadow-xl" transition={{ type: "spring", bounce: 0.1, duration: 0.5 }} />
                                        )}
                                        <span className="relative z-10">ميلادي</span>
                                    </button>
                                </div>

                                {/* Navigation Bar */}
                                <div className="flex items-center justify-between mb-8 px-2">
                                    <button onClick={calendarData.next} className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all duration-300">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                    <div className="text-center"><h3 className="text-xl font-black text-gray-900 tracking-tight">{calendarData.title}</h3></div>
                                    <button onClick={calendarData.prev} className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all duration-300">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Week Labels */}
                                <div className="grid grid-cols-7 gap-2 mb-4">
                                    {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map(d => (
                                        <div key={d} className="text-[11px] font-black text-gray-300 text-center py-1">{d}</div>
                                    ))}
                                </div>

                                {/* Responsive Grid */}
                                <motion.div key={mode + calendarData.title} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-7 gap-2 gap-y-3">
                                    {calendarData.days.map((date, i) => {
                                        if (!date) return <div key={`empty-${i}`} />
                                        const isSelected = selectedDate?.toDateString() === date.toDateString()
                                        const today = new Date().toDateString() === date.toDateString()
                                        const past = date < new Date() && !today
                                        const dNum = mode === 'hijri' ? getHijriParts(date).day : date.getDate()

                                        return (
                                            <button
                                                key={date.toISOString()}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onChange(date.toISOString().split('T')[0])
                                                    setIsOpen(false)
                                                }}
                                                className={cn(
                                                    "aspect-square rounded-2xl flex flex-col items-center justify-center text-sm font-black transition-all relative group/day overflow-hidden",
                                                    isSelected ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 ring-4 ring-indigo-100 scale-110 z-10" :
                                                        today ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-200" :
                                                            past ? "text-gray-300 hover:bg-gray-50 hover:text-gray-400" :
                                                                "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                                )}
                                            >
                                                <span className="relative z-10">{dNum}</span>
                                                {today && !isSelected && <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
                                            </button>
                                        )
                                    })}
                                </motion.div>

                                {/* Fast Actions */}
                                <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
                                    <button onClick={(e) => { e.stopPropagation(); setViewDate(new Date()); }} className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-indigo-600 transition-colors">
                                        <Target className="w-5 h-5" />العودة لليوم
                                    </button>
                                    <div className="text-left text-xs">
                                        <span className="text-[10px] font-black text-gray-300 uppercase block mb-1">المقارب</span>
                                        <span className="font-bold text-indigo-500/70 bg-indigo-50 px-4 py-2 rounded-full">
                                            {mode === 'gregorian' ? formatLongHijri(viewDate) : formatLongGregorian(viewDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
