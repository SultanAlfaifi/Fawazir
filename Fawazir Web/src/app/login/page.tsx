'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { login } from '@/actions/auth'
import { Loader2, ArrowLeft, Mail, Lock, Sparkles } from 'lucide-react'

export default function LoginPage() {
    const [state, action, pending] = useActionState(login, undefined)

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans text-gray-900" dir="rtl">

            <div className="w-full max-w-sm space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-flex w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl items-center justify-center shadow-lg shadow-amber-500/20 mb-4 transition-transform hover:scale-105 active:scale-95">
                        <Sparkles className="w-8 h-8 text-white" />
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">مرحباً بعودتك!</h1>
                    <p className="text-gray-500 font-medium">سجل دخولك لاستكمال رحلة التحدي</p>
                </div>

                {/* Form */}
                <form action={action} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 block text-right">البريد الإلكتروني</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-focus-within:text-amber-600 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full pr-10 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                />
                            </div>
                            {state?.errors?.email && (
                                <p className="text-red-500 text-xs font-bold text-right pt-1">{state.errors.email[0]}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 block text-right">كلمة المرور</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-focus-within:text-amber-600 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pr-10 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                />
                            </div>
                            {state?.errors?.password && (
                                <p className="text-red-500 text-xs font-bold text-right pt-1">{state.errors.password[0]}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold shadow-lg shadow-gray-900/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        {pending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>الدخول</span>
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            </>
                        )}
                    </button>

                    {/* Register Links */}
                    <div className="pt-6 border-t border-gray-100 flex flex-col items-center gap-3">
                        <p className="text-gray-500 text-sm font-medium">ليس لديك حساب؟</p>
                        <div className="flex gap-3 w-full">
                            <Link href="/register" className="flex-1 py-3 text-center rounded-xl border border-gray-200 hover:border-amber-500 hover:bg-amber-50 text-gray-700 hover:text-amber-700 font-bold text-sm transition-all">
                                إنشاء حساب جديد
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
