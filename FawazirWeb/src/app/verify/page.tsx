'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, PartyPopper } from 'lucide-react'
import { motion } from 'framer-motion'
import { verifyEmail } from '@/actions/auth'
import Link from 'next/link'

export default function VerifyPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [error, setError] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setError('رابط التفعيل غير صحيح')
            return
        }

        const runVerify = async () => {
            const result = await verifyEmail(token)
            if (result.success) {
                setStatus('success')
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/login?verified=true')
                }, 3000)
            } else {
                setStatus('error')
                setError(result.error || 'حدث خطأ غير متوقع')
            }
        }

        runVerify()
    }, [token, router])

    return (
        <div className="min-h-dynamic bg-white flex items-center justify-center p-4 font-sans text-gray-900 text-center" dir="rtl">
            <div className="w-full max-w-md space-y-8">
                {status === 'loading' && (
                    <div className="space-y-6">
                        <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto" />
                        <h1 className="text-2xl font-black">جاري التحقق من حسابك...</h1>
                        <p className="text-gray-500">نحن نتأكد من رمز التفعيل، لحظة واحدة.</p>
                    </div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="relative inline-block">
                            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="absolute -top-2 -right-2"
                            >
                                <PartyPopper className="w-8 h-8 text-amber-500" />
                            </motion.div>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900">تم التفعيل بنجاح!</h1>
                        <p className="text-gray-500 font-medium">مبارك لك، تم تفعيل حسابك. جاري تحويلك لصفحة تسجيل الدخول...</p>
                        <Link href="/login" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold">انتقل الآن</Link>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-6"
                    >
                        <XCircle className="w-20 h-20 text-red-500 mx-auto" />
                        <h1 className="text-3xl font-black text-gray-900">فشل التفعيل</h1>
                        <p className="text-red-500 font-bold">{error}</p>
                        <p className="text-gray-500">جرب إعادة إرسال الرابط من صفحة تسجيل الدخول.</p>
                        <Link href="/login" className="inline-block px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-xl font-bold">العودة للدخول</Link>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
