import { verifySession } from '@/lib/session'
import { LogOut, LayoutGrid, User as UserIcon, List } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/actions/auth'
import { SultanaChatButton } from '@/components/SultanaChatButton'
import { getMyActiveTeam } from '@/actions/days'
import { HeaderTeamChat } from '@/components/HeaderTeamChat'
import { NotificationCenter } from '@/components/NotificationCenter'

export default async function PlayerLayout({ children }: { children: React.ReactNode }) {
    const session = await verifySession()
    const activeTeam = await getMyActiveTeam()

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans" dir="rtl">

            {/* Minimal Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/app/competitions" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                            ف
                        </div>
                        <span className="hidden sm:block font-black text-lg tracking-tight">فوازير</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/app/competitions" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all" title="المسابقات">
                        <LayoutGrid className="w-5 h-5" />
                    </Link>

                    <NotificationCenter />

                    {activeTeam && (
                        <HeaderTeamChat
                            teamId={activeTeam.id}
                            currentUserId={session.userId}
                            teammateName={activeTeam.members[0]?.displayName || 'الزميل'}
                        />
                    )}

                    <Link href="/app/me" className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full hover:border-amber-500/20 transition-all group">
                        <span className="text-xl group-hover:scale-110 transition-transform">{session.avatar}</span>
                        <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">{session.displayName}</span>
                    </Link>
                    <form action={logout}>
                        <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="تسجيل خروج">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-4 md:p-8 pb-32 min-h-[calc(100vh-80px)]">
                {children}
            </main>

            <SultanaChatButton />
        </div>
    )
}
