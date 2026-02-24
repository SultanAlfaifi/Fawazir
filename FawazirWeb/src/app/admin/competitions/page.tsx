import { verifySession } from '@/lib/session'
import prisma from '@/lib/db'
import { Plus, Users, Calendar, Crown, Copy, MoreVertical, Trophy, Star, Activity, ArrowUpRight, Shield, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import AdminShell from '@/components/admin/AdminShell'
import * as motion from 'framer-motion/client'

export default async function AdminCompetitionsPage() {
    const session = await verifySession()

    const myCompetitions = await prisma.competition.findMany({
        where: { ownerId: session.userId },
        include: {
            _count: { select: { participants: true, days: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    const totalParticipants = myCompetitions.reduce((acc, curr) => acc + curr._count.participants, 0)
    const activeCompetitions = myCompetitions.length // Simplified for now

    return (
        <AdminShell session={session}>
            <div className="space-y-10 pb-20">
                {/* Majestic Welcome Header */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 p-8 sm:p-12 text-white">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/20 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-amber-400 font-bold mb-4 uppercase tracking-[0.2em] text-xs">
                                <Shield className="w-4 h-4" />
                                <span>لوحة الإشراف المعتمدة</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
                                أهلاً بك مجدداً، <br />
                                <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                                    {session.displayName}
                                </span>
                            </h1>
                            <p className="text-gray-400 font-medium max-w-md leading-relaxed">
                                هنا يمكنك التحكم بمسابقاتك وإدارة المسابقات بكافة تفاصيلها. ابدأ الآن بتطوير تجربة المشاركين.
                            </p>
                        </div>
                        <Link
                            href="/admin/competitions/create"
                            className="group flex items-center justify-center gap-3 px-8 py-5 bg-white text-gray-950 rounded-2xl font-black text-lg hover:bg-amber-400 transition-all shadow-2xl shadow-white/5 active:scale-95"
                        >
                            <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                            <span>إنشاء مسابقة جديدة</span>
                        </Link>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'إجمالي المسابقات', val: myCompetitions.length, icon: Trophy, color: 'amber' },
                        { label: 'إجمالي المشاركين', val: totalParticipants, icon: Users, color: 'blue' },
                        { label: 'المسابقات النشطة', val: activeCompetitions, icon: Activity, color: 'emerald' },
                        { label: 'إجمالي الأيام', val: myCompetitions.reduce((acc, c) => acc + c._count.days, 0), icon: Calendar, color: 'rose' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
                            </div>
                            <div className="text-2xl font-black text-gray-900 mb-1">{stat.val}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <LayoutGrid className="w-6 h-6 text-amber-500" />
                        مسابقاتك الحالية
                    </h2>
                    <div className="text-sm font-bold text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full">
                        {myCompetitions.length} مسابقة
                    </div>
                </div>

                {myCompetitions.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] py-24 text-center space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-5xl">✨</div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900">المكان خاوٍ هنا!</h3>
                            <p className="text-gray-500 max-w-sm mx-auto font-medium">ابدأ الآن ببث الحياة في هذا المكان وأنشئ أول تحدٍ لك.</p>
                        </div>
                        <Link
                            href="/admin/competitions/create"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-950 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            إنشاء الأولى
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myCompetitions.map((comp) => (
                            <div key={comp.id} className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-100 transition-colors">
                                        🏺
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100 rounded-xl transition-all">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-amber-600 transition-colors">
                                        {comp.title}
                                    </h3>
                                    <p className="text-gray-500 font-medium text-sm line-clamp-2 leading-relaxed">
                                        {comp.description || "لا يوجد وصف مدخل لهذه المسابقة، اضغط للإدارة."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50 rounded-2xl p-4 group-hover:bg-amber-50/50 transition-colors">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Users className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">مشارك</span>
                                        </div>
                                        <div className="text-xl font-black text-gray-900">{comp._count.participants}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-4 group-hover:bg-amber-50/50 transition-colors">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">يوم</span>
                                        </div>
                                        <div className="text-xl font-black text-gray-900">{comp._count.days}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 p-4 bg-gray-900 rounded-[1.5rem] shadow-xl shadow-gray-950/20 relative z-20">
                                    <div className="pr-2">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">رمز الانضمام</span>
                                        <span className="font-mono font-black text-lg text-white tracking-[0.2em]">{comp.code}</span>
                                    </div>
                                    <button
                                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-90"
                                        title="نسخ الرمز"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(comp.code);
                                        }}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="mt-6 flex items-center justify-center">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        المسابقة نشطة حالياً
                                    </div>
                                </div>

                                <Link href={`/admin/competition/${comp.code}`} className="absolute inset-0 z-10" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminShell>
    )
}

