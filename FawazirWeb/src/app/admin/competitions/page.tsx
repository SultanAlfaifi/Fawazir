import { verifySession } from '@/lib/session'
import prisma from '@/lib/db'
import { Plus, Users, Calendar, Crown, Copy, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminCompetitionsPage() {
    const session = await verifySession()

    const myCompetitions = await prisma.competition.findMany({
        where: { ownerId: session.userId },
        include: {
            _count: { select: { participants: true, days: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <AdminShell session={session}>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="text-right">
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">المسابقات التي<br className="sm:hidden" /> تديرها</h1>
                        <p className="text-gray-500 font-medium mt-3 text-sm sm:text-base max-w-sm">يمكنك إدارة المسابقات، إضافة أيام، ومراقبة تقدم المشاركين.</p>
                    </div>
                    <Link
                        href="/admin/competitions/create"
                        className="flex items-center justify-center gap-3 px-6 py-4 sm:py-3 bg-gray-900 text-white rounded-2xl sm:rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-xl shadow-gray-900/10 active:scale-95 w-full sm:w-auto shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        <span>مسابقة جديدة</span>
                    </Link>
                </div>

                {myCompetitions.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">🏆</div>
                        <h3 className="text-xl font-bold text-gray-900">لم تنشئ أي مسابقة بعد</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">ابدأ مسيرتك الإشرافية وأنشئ تحديك الأول الآن!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCompetitions.map((comp) => (
                            <div key={comp.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-xl transition-all group overflow-hidden relative">
                                {/* Floating Blob */}
                                <div className="absolute -right-20 -top-20 w-48 h-48 bg-gray-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                <div className="relative mb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-black text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                                            {comp.title}
                                        </h2>
                                        <button className="text-gray-400 hover:text-gray-900"><MoreVertical className="w-5 h-5" /></button>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 h-10">{comp.description || "لا يوجد وصف."}</p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between mb-6 group-hover:bg-amber-50 transition-colors relative z-20">
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">رمز الانضمام</div>
                                        <div className="font-mono font-black text-2xl text-gray-900 tracking-widest">{comp.code}</div>
                                    </div>
                                    <button className="p-2 bg-white rounded-lg text-gray-400 hover:text-amber-600 hover:scale-105 transition-all shadow-sm" title="نسخ الرمز">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-xs font-bold text-gray-400 px-2">
                                    <div className="flex items-center gap-1.5" title="المشاركين">
                                        <Users className="w-4 h-4" />
                                        <span>{comp._count.participants}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="عدد الأيام">
                                        <Calendar className="w-4 h-4" />
                                        <span>{comp._count.days}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50 px-3 py-1.5 border border-emerald-100/50 rounded-lg shadow-sm">
                                        <Crown className="w-3 h-3" />
                                        <span>نشط</span>
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

