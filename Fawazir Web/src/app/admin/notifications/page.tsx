import { getUsers } from '@/actions/admin'
import { sendNotification, getNotificationsLog } from '@/actions/notifications'
import { Bell, Send } from 'lucide-react'

export default async function AdminNotificationsPage() {
    const users = await getUsers()
    const logs = await getNotificationsLog()

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">الإشعارات</h1>

            {/* Send Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                <h2 className="font-bold flex items-center gap-2">
                    <Send className="w-5 h-5 text-amber-500" />
                    <span>إرسال إشعار جديد</span>
                </h2>

                <form action={sendNotification} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">إلى</label>
                            <select name="userId" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 outline-none focus:border-amber-500">
                                <option value="ALL">الجميع (4 لاعبين)</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.displayName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">النوع</label>
                            <select name="type" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 outline-none focus:border-amber-500">
                                <option value="INFO">معلومة (Info)</option>
                                <option value="SUCCESS">نجاح (Success)</option>
                                <option value="WARNING">تنبيه (Warning)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-400">الرسالة</label>
                        <textarea
                            name="message" required rows={3}
                            placeholder="اكتب رسالتك هنا..."
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 outline-none focus:border-amber-500"
                        />
                    </div>

                    <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-bold transition-colors w-full md:w-auto">
                        إرسال الإشعار
                    </button>
                </form>
            </div>

            {/* Log */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-gray-800/20">
                    <span className="text-sm text-gray-400">سجل الإشعارات المرسلة</span>
                </div>
                <div className="divide-y divide-gray-800">
                    {logs.map(n => (
                        <div key={n.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="flex items-start gap-3">
                                <Bell className={`w-5 h-5 mt-1 ${n.type === 'WARNING' ? 'text-red-500' : n.type === 'SUCCESS' ? 'text-emerald-500' : 'text-blue-500'}`} />
                                <div>
                                    <p className="font-medium text-gray-200">{n.message}</p>
                                    <p className="text-xs text-gray-500">إلى: {n.user?.displayName || 'غير معروف'}</p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-600 font-mono">
                                {new Date(n.createdAt).toLocaleString('ar-SA')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
