import prisma from '@/lib/db'
import { toggleDayStatus, toggleDayTeams, generateTeams } from '@/actions/admin'
import Link from 'next/link'
import { Edit, Lock, Unlock, Zap, Calendar, Settings2, Clock, Sparkles, Users, Users2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { verifySession } from '@/lib/session'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminDaysPage() {
    const session = await verifySession()
    const days = await prisma.day.findMany({
        orderBy: { dayNumber: 'asc' }
    })

    return (
        <AdminShell session={session}>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Header Area */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-gray-100 pb-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100">
                            <Settings2 className="w-3.5 h-3.5 text-sky-600" />
                            <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">إدارة المحتوى والمخطط الزمني</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">برنامج الـ ٣٠ يومًا</h1>
                        <p className="text-gray-500 font-medium max-w-lg">التحكم الكامل في رحلة المتسابقين. افتح الأيام يدوياً أو اترك النظام يعمل تلقائياً حسب الجدول الزمني.</p>
                    </div>

                    <div className="flex items-center gap-6 bg-white p-3 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-center px-4 border-l border-gray-100">
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">الإجمالي</span>
                            <span className="text-xl font-black text-gray-900">٣٠</span>
                        </div>
                        <div className="flex flex-col items-center px-4 border-l border-gray-100">
                            <span className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter">مفتوح</span>
                            <span className="text-xl font-black text-gray-900">{days.filter(d => d.isManualOpen).length}</span>
                        </div>
                        <div className="flex flex-col items-center px-4">
                            <span className="text-[10px] text-rose-600 font-black uppercase tracking-tighter">مغلق</span>
                            <span className="text-xl font-black text-gray-900">{days.filter(d => !d.isManualOpen).length}</span>
                        </div>

                    </div>
                </div>

                {/* Grid Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {days.map((day) => {
                        const isOpen = day.isManualOpen;

                        let statusLabel = "مغلق";
                        let statusColor = "bg-gray-100 text-gray-500";
                        let icon = <Lock className="w-4 h-4" />;

                        if (isOpen) {
                            statusLabel = "مفتوح";
                            statusColor = "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm";
                            icon = <Unlock className="w-4 h-4" />;
                        }

                        return (
                            <div key={day.id} className="group relative bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden transition-all hover:border-gray-200 hover:shadow-xl shadow-sm">
                                {/* Card Header */}
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-2xl text-amber-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                            {day.dayNumber}
                                        </div>
                                        <div className={cn("px-3 py-1.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", statusColor)}>
                                            {icon}
                                            {statusLabel}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-black text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{day.title || 'بدون عنوان'}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                                            <Calendar className="w-4 h-4 opacity-50" />
                                            {day.unlockDate ? new Date(day.unlockDate).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' }) : 'غير محدد'}
                                        </div>
                                    </div>
                                </div>

                                {/* Control Bar */}
                                <div className="px-3 pb-3">
                                    <div className="bg-gray-50 rounded-[1.8rem] p-2 flex items-center justify-between border border-gray-100">
                                        <div className="flex items-center gap-1">
                                            <StatusButton
                                                active={day.isManualOpen}
                                                icon={<Unlock className="w-4 h-4" />}
                                                color="emerald"
                                                action={toggleDayStatus.bind(null, day.id, 'OPEN')}
                                                label="فتح"
                                            />
                                            <StatusButton
                                                active={!day.isManualOpen}
                                                icon={<Lock className="w-4 h-4" />}
                                                color="rose"
                                                action={toggleDayStatus.bind(null, day.id, 'LOCKED')}
                                                label="قفل"
                                            />
                                        </div>

                                        <Link href={`/admin/days/${day.id}`} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-xs font-black rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-sm">
                                            <span>تعديل</span>
                                            <Edit className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </AdminShell>
    )
}

function StatusButton({ active, icon, color, action, label }: any) {
    const colors = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white",
        rose: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white",
        sky: "bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-600 hover:text-white",
        amber: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white",
    }

    return (
        <form action={action}>
            <button
                type="submit"
                title={label}
                className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all border group/btn",
                    active ? colors[color as keyof typeof colors] : "bg-transparent text-gray-400 border-transparent hover:border-gray-200 hover:text-gray-900"
                )}
            >
                <div className="transition-transform group-hover/btn:scale-110">{icon}</div>
            </button>
        </form>
    )
}

