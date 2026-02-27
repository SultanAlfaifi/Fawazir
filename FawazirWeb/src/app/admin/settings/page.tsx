import { updateSettings } from '@/actions/admin'
import prisma from '@/lib/db'
import { Save, Calendar, Settings } from 'lucide-react'
import { verifySession } from '@/lib/session'
import AdminShell from '@/components/admin/AdminShell'

async function getCompetitionStart() {
    const setting = await prisma.settings.findUnique({
        where: { key: 'competitionStart' },
    })
    return setting?.value || '2026-02-18'
}

export default async function AdminSettingsPage() {
    const session = await verifySession()
    const competitionStart = await getCompetitionStart()

    return (
        <AdminShell session={session}>
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
                <div className="space-y-4 border-b border-gray-100 pb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100">
                        <Settings className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">إعدادات النظام</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">الإعدادات العامة</h1>
                    <p className="text-gray-500 font-medium">تكوين إعدادات النظام وتواريخ البدء للتحدي.</p>
                </div>

                <form action={updateSettings} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 font-black text-gray-900 text-lg">
                            <Calendar className="w-6 h-6 text-amber-500" />
                            <span>تاريخ بداية التحدي</span>
                        </label>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">سيتم استخدام هذا التاريخ لحساب فتح الأيام تلقائياً. اليوم الأول يفتح في هذا التاريخ، واليوم الثاني في اليوم الذي يليه، وهكذا دواليك.</p>

                        <input
                            type="date"
                            name="competitionStart"
                            defaultValue={competitionStart}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 font-bold focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                        />
                    </div>

                    <div className="pt-8 border-t border-gray-100">
                        <button type="submit" className="flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-black transition-all w-full md:w-auto shadow-xl shadow-gray-900/10 active:scale-95">
                            <Save className="w-5 h-5" />
                            <span>حفظ الإعدادات</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminShell>
    )
}

