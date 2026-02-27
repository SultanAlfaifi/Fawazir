import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { COOKIE_NAME } from '../constants';
import { logoutAnalytics } from '../action';
import UsersTable from './UsersTable';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'إدارة المستخدمين | فوازير',
    description: 'قائمة بالمستخدمين وحذفهم لمنصة فوازير'
};

export const revalidate = 0; // Always fresh data

export default async function UsersAnalyticsPage() {
    const cookieStore = await cookies();
    const isAuth = cookieStore.get(COOKIE_NAME)?.value === 'authenticated';

    if (!isAuth) {
        return redirect('/login');
    }

    // Fetch all users with basic competition stats without getting password hashes
    const rawUsers = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            displayName: true,
            createdAt: true,
            emailVerified: true,
            _count: {
                select: {
                    myCompetitions: true,
                    joinedCompetitions: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedUsers = rawUsers.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
        displayName: u.displayName,
        createdAt: u.createdAt.toISOString(),
        emailVerified: u.emailVerified ? u.emailVerified.toISOString() : null,
        competitionsOwned: u._count.myCompetitions,
        participations: u._count.joinedCompetitions
    }));

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-blue-500/30 font-sans" dir="rtl">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-indigo-900/20 via-blue-900/10 to-transparent pointer-events-none blur-3xl" />

            <header className="relative z-10 border-b border-white/5 bg-gray-900/40 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/analytics" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 text-white rounded-xl flex items-center justify-center transition-colors">
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center shadow-inner shadow-indigo-500/20">
                                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white tracking-tight">إدارة المستخدمين</h1>
                                <p className="text-xs text-gray-500 font-medium tracking-wide">البيانات الشاملة وحذف الحسابات (بدون كلمات المرور)</p>
                            </div>
                        </div>
                    </div>

                    <form action={logoutAnalytics}>
                        <button type="submit" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/20 active:scale-95">
                            إنهاء الجلسة
                        </button>
                    </form>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <UsersTable initialUsers={formattedUsers} />
            </main>
        </div>
    );
}
