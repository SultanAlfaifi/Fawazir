'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, ArrowRight, Loader2, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { resendVerificationEmail, checkVerificationStatus } from '@/actions/auth'
import { useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || ''
    const [cooldown, setCooldown] = useState(0)
    const [isPending, setIsPending] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Poll for verification status
    useEffect(() => {
        if (!email) return

        const interval = setInterval(async () => {
            const status = await checkVerificationStatus(email)
            if (status.verified) {
                if (status.role === 'ADMIN') {
                    router.push('/admin/competitions')
                } else {
                    router.push('/app/competitions')
                }
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [email, router])

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [cooldown])

    const handleResend = async () => {
        if (cooldown > 0) return
        setIsPending(true)
        setMessage(null)

        const result = await resendVerificationEmail(email)

        if (result.success) {
            setMessage({ type: 'success', text: 'تم إرسال رابط تفعيل جديد إلى بريدك الإلكتروني.' })
            setCooldown(60)
        } else {
            setMessage({ type: 'error', text: result.error || 'حدث خطأ ما' })
        }
        setIsPending(false)
    }

    return (
        <div className="min-h-dynamic bg-white flex items-center justify-center p-4 font-sans text-gray-900" dir="rtl">
            <div className="w-full max-w-md text-center space-y-8">
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex w-24 h-24 bg-amber-50 rounded-[2.5rem] items-center justify-center shadow-xl shadow-amber-500/10 border-2 border-amber-100"
                >
                    <Mail className="w-10 h-10 text-amber-600" />
                </motion.div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-gray-900">تحقق من بريدك!</h1>
                    <p className="text-gray-500 font-medium">
                        لقد أرسلنا رابط تفعيل إلى <br />
                        <span className="text-gray-900 font-bold">{email}</span>
                    </p>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                <div className="pt-4 space-y-4">
                    <button
                        onClick={handleResend}
                        disabled={cooldown > 0 || isPending}
                        className="w-full py-4 bg-gray-950 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : cooldown > 0 ? (
                            <>
                                <RefreshCw className="w-5 h-5 opacity-50" />
                                <span>إعادة الإرسال بعد ({cooldown}ث)</span>
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-5 h-5" />
                                <span>إعادة إرسال الرابط</span>
                            </>
                        )}
                    </button>

                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors py-2"
                    >
                        <ArrowRight className="w-4 h-4 translate-y-[1px]" />
                        <span>العودة لتسجيل الدخول</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
