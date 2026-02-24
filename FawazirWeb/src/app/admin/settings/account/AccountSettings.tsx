'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    Mail,
    Lock,
    Trash2,
    LogOut,
    Save,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    KeyRound,
    Settings2,
    Fingerprint
} from 'lucide-react'
import {
    updateDisplayName,
    updateEmail,
    updatePassword,
    deleteAccount,
    logout
} from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function AdminAccountSettingsPage({ session }: { session: any }) {
    const router = useRouter()
    const [isPending, setIsPending] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string, target: string } | null>(null)

    const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get('displayName') as string

        setIsPending('name')
        const res = await updateDisplayName(name)
        if (res.success) {
            setMessage({ type: 'success', text: 'تم تحديث الاسم بنجاح', target: 'name' })
        } else {
            setMessage({ type: 'error', text: res.error || 'خطأ غير معروف', target: 'name' })
        }
        setIsPending(null)
    }

    const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string

        setIsPending('email')
        const res = await updateEmail(email)
        if (res.success) {
            setMessage({ type: 'success', text: 'تم تحديث البريد الإلكتروني بنجاح', target: 'email' })
        } else {
            setMessage({ type: 'error', text: res.error || 'خطأ غير معروف', target: 'email' })
        }
        setIsPending(null)
    }

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        setIsPending('password')
        const res = await updatePassword(formData)
        if (res.success) {
            setMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح', target: 'password' })
            e.currentTarget.reset()
        } else {
            setMessage({ type: 'error', text: res.error || 'خطأ غير معروف', target: 'password' })
        }
        setIsPending(null)
    }

    const handleDeleteAccount = async () => {
        if (!confirm('هل أنت متأكد من حذف حسابك نهائياً؟')) return

        setIsPending('delete')
        const res = await deleteAccount()
        if (res.success) {
            router.push('/')
        } else {
            alert(res.error)
        }
        setIsPending(null)
    }

    return (
        <div className="max-w-3xl mx-auto space-y-12 pb-24">
            {/* Minimalist Header */}
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex p-3 bg-gray-50 rounded-3xl border border-gray-100 mb-2"
                >
                    <Settings2 className="w-6 h-6 text-gray-900" />
                </motion.div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">إعدادات الحساب</h1>
                <p className="text-gray-500 font-medium">تحكم في هويتك الرقمية وأمان حسابك في فوازير</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Profile Section */}
                <SettingsCard
                    title="هويتك الشخصية"
                    icon={User}
                    delay={0.1}
                >
                    <div className="space-y-8">
                        <form onSubmit={handleUpdateName} className="space-y-4">
                            <InputField
                                label="الاسم المعروض"
                                name="displayName"
                                defaultValue={session.displayName}
                                icon={Fingerprint}
                                placeholder="اسمك الذي يظهر للجميع"
                            />
                            <div className="flex justify-end">
                                <SubmitButton
                                    label="حفظ الاسم"
                                    isPending={isPending === 'name'}
                                    isActive={message?.target === 'name' && message.type === 'success'}
                                />
                            </div>
                            {message?.target === 'name' && <StatusMessage message={message} />}
                        </form>

                        <div className="h-px bg-gray-100 mx-4" />

                        <form onSubmit={handleUpdateEmail} className="space-y-4">
                            <InputField
                                label="البريد الإلكتروني"
                                name="email"
                                type="email"
                                defaultValue={session.email}
                                icon={Mail}
                                placeholder="name@example.com"
                            />
                            <div className="flex justify-end">
                                <SubmitButton
                                    label="تحديث البريد"
                                    isPending={isPending === 'email'}
                                    isActive={message?.target === 'email' && message.type === 'success'}
                                />
                            </div>
                            {message?.target === 'email' && <StatusMessage message={message} />}
                        </form>
                    </div>
                </SettingsCard>

                {/* Password Section */}
                <SettingsCard
                    title="كلمة المرور"
                    icon={Lock}
                    delay={0.2}
                >
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <InputField
                            label="كلمة المرور الحالية"
                            name="oldPassword"
                            type="password"
                            icon={KeyRound}
                            placeholder="••••••••"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField
                                label="كلمة المرور الجديدة"
                                name="newPassword"
                                type="password"
                                icon={Lock}
                                placeholder="••••••••"
                            />
                            <InputField
                                label="تأكيد الكلمة الجديدة"
                                name="confirmPassword"
                                type="password"
                                icon={CheckCircle2}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="flex justify-end">
                            <SubmitButton
                                label="تغيير كلمة المرور"
                                isPending={isPending === 'password'}
                                isActive={message?.target === 'password' && message.type === 'success'}
                            />
                        </div>
                        {message?.target === 'password' && <StatusMessage message={message} />}
                    </form>
                </SettingsCard>

                {/* Account Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 text-gray-900 rounded-[2rem] font-black hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>تسجيل الخروج</span>
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        disabled={isPending === 'delete'}
                        className="flex items-center gap-3 px-8 py-4 text-rose-500 hover:text-rose-600 font-bold transition-all disabled:opacity-50"
                    >
                        {isPending === 'delete' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        <span>حذف الحساب نهائياً</span>
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

function SettingsCard({ title, icon: Icon, children, delay }: { title: string, icon: any, children: React.ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
        >
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-100/50">
                    <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 leading-none">{title}</h2>
            </div>
            {children}
        </motion.div>
    )
}

function InputField({ label, icon: Icon, ...props }: any) {
    return (
        <div className="space-y-2.5">
            <label className="block text-sm font-bold text-gray-500 mr-2 tracking-wide truncate">{label}</label>
            <div className="relative group">
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
                <input
                    {...props}
                    className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] py-4.5 pr-14 pl-6 text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-gray-950/10 focus:ring-4 focus:ring-gray-950/[0.03] outline-none transition-all duration-300"
                />
            </div>
        </div>
    )
}

function SubmitButton({ label, isPending, isActive }: { label: string, isPending: boolean, isActive?: boolean }) {
    return (
        <button
            type="submit"
            disabled={isPending}
            className={cn(
                "min-w-[160px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50",
                isActive
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-gray-950 text-white hover:bg-gray-800 shadow-xl shadow-gray-950/10"
            )}
        >
            {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : isActive ? (
                <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>تم الحفظ</span>
                </>
            ) : (
                <>
                    <Save className="w-5 h-5" />
                    <span>{label}</span>
                </>
            )}
        </button>
    )
}

function StatusMessage({ message }: { message: { type: 'success' | 'error', text: string } }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl font-bold text-sm mt-4",
                    message.type === 'success' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                )}
            >
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{message.text}</span>
            </motion.div>
        </AnimatePresence>
    )
}
