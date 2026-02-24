import React from 'react'
import Link from 'next/link'
import { Sparkles, Twitter, Instagram, Mail } from 'lucide-react'

export function HomeFooter() {
    return (
        <footer className="py-20 bg-white border-t border-gray-100 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center">

                    {/* Brand Card - Cute & Clean */}
                    <div className="bg-gray-50 p-8 rounded-[3rem] border-2 border-white shadow-sm flex flex-col items-center gap-6 mb-12 w-full max-w-sm">
                        <div className="w-14 h-14 bg-gray-950 rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-gray-900/10">
                            <Sparkles className="w-8 h-8 text-orange-400" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-gray-950 tracking-tighter">فوازير</h2>
                            <p className="text-sm text-gray-400 font-bold max-w-[200px]">المنصة الأمتع لإدارة مسابقاتك وتحدياتك.</p>
                        </div>
                    </div>

                    {/* Quick Links - Premium Style */}
                    <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12">
                        {['الرئيسية', 'المسابقات', 'سلطانة AI', 'عن فوازير'].map((link, i) => (
                            <Link
                                key={i}
                                href="#"
                                className="text-xs font-black text-gray-400 hover:text-gray-950 transition-colors tracking-tight uppercase"
                            >
                                {link}
                            </Link>
                        ))}
                    </nav>

                    {/* Socials - Soft & Cute */}
                    <div className="flex items-center gap-5 mb-12">
                        {[
                            { icon: <Twitter className="w-5 h-5" />, href: '#' },
                            { icon: <Instagram className="w-5 h-5" />, href: '#' },
                            { icon: <Mail className="w-5 h-5" />, href: '#' },
                        ].map((social, i) => (
                            <Link
                                key={i}
                                href={social.href}
                                className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white hover:-translate-y-1 transition-all duration-300"
                            >
                                {social.icon}
                            </Link>
                        ))}
                    </div>

                    {/* Simple Bottom Bar */}
                    <div className="w-full pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                        <p>© 2026 FAWAZIR IDENTITY. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-8">
                            <Link href="#" className="hover:text-gray-950 transition-colors">PRIVACY</Link>
                            <Link href="#" className="hover:text-gray-950 transition-colors">TERMS</Link>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    )
}
