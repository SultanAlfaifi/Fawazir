'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ArrowRight, Home } from 'lucide-react'

export function BackButton({ className }: { className?: string }) {
    const router = useRouter()
    const pathname = usePathname()

    // If we are at the root of the app or admin, maybe we don't need a back button, 
    // or it should go to the landing page?
    // For now, simple back behavior is usually what's expected for "Back".

    // Optional: Hide on main dashboards if desired, but user asked for it generally.
    const isRoot = pathname === '/app' || pathname === '/admin';

    return (
        <button
            onClick={() => router.back()}
            className={`p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95 ${className}`}
            title="رجوع"
        >
            <ArrowRight className="w-5 h-5" />
        </button>
    )
}
