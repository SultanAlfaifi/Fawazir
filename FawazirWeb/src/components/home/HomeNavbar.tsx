'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function HomeNavbar() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm'
                    : 'py-8 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Clean Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-950 rounded-xl flex items-center justify-center shadow-lg shadow-gray-900/10 active:scale-90 transition-transform">
                        <Sparkles className="w-6 h-6 text-orange-400" />
                    </div>
                    <span className="text-xl font-black text-gray-950 tracking-tighter">فوازير</span>
                </Link>

                {/* Minimalist Action */}
                <Link
                    href="/login"
                    className="bg-gray-950 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-900/10"
                >
                    دخول
                </Link>
            </div>
        </motion.nav>
    )
}
