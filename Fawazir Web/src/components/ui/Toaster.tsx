'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ConfirmOptions {
    title: string
    message: string
    onConfirm: () => void
    type?: 'danger' | 'warning'
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void
    confirm: (options: ConfirmOptions) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null)

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 5000)
    }, [])

    const confirm = useCallback((options: ConfirmOptions) => {
        setConfirmState(options)
    }, [])

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toast, confirm }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                                flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border min-w-[300px] max-w-md
                                ${t.type === 'success' ? 'bg-white border-emerald-100' :
                                    t.type === 'error' ? 'bg-white border-rose-100' :
                                        'bg-white border-blue-100'}
                            `}>
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                    ${t.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                        t.type === 'error' ? 'bg-rose-50 text-rose-600' :
                                            'bg-blue-50 text-blue-600'}
                                `}>
                                    {t.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                    {t.type === 'error' && <AlertCircle className="w-5 h-5" />}
                                    {t.type === 'info' && <Info className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-sm font-black text-gray-900 leading-tight">{t.message}</p>
                                </div>
                                <button
                                    onClick={() => removeToast(t.id)}
                                    className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Custom Confirm Modal */}
            <AnimatePresence>
                {confirmState && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmState(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] p-8 sm:p-10 w-full max-w-sm shadow-2xl border border-gray-100 text-right"
                        >
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 ml-auto ${confirmState.type === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'}`}>
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">{confirmState.title}</h3>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">{confirmState.message}</p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        confirmState.onConfirm()
                                        setConfirmState(null)
                                    }}
                                    className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${confirmState.type === 'danger' ? 'bg-rose-600 shadow-rose-600/20 hover:bg-rose-700' : 'bg-orange-600 shadow-orange-600/20 hover:bg-orange-700'}`}
                                >
                                    تأكيد الإجراء
                                </button>
                                <button
                                    onClick={() => setConfirmState(null)}
                                    className="w-full py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    تراجع
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) throw new Error('useToast must be used within ToastProvider')
    return context
}
