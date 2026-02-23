import { getDays } from '@/actions/days'
import { getUsers, assignTask, getAdminTasks, deleteTask, toggleTaskComplete } from '@/actions/admin'
import { Trash2, Plus, CheckCircle, Circle, Filter, X } from 'lucide-react'
import Link from 'next/link'

export default async function AdminTasksPage({ searchParams }: { searchParams: { dayId?: string, userId?: string } }) {
    const days = await getDays()
    const users = await getUsers()

    const selectedDayId = searchParams.dayId
    const selectedUserId = searchParams.userId

    // If no filters, get all? Or default to today?
    // Let's get all tasks sorted by date desc if no filter, or filter if present.
    // Actually getAdminTasks logic: if dayId not passed, it ignores day filter. If userId not passed/ALL, ignores user filter.
    // So by default it shows ALL tasks.

    const tasks = await getAdminTasks(selectedDayId, selectedUserId)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">إدارة المهام</h1>
                <p className="text-gray-400 mt-1">توزيع المهام ومتابعة إنجاز اللاعبين</p>
            </div>

            {/* Assignment Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 shadow-lg">
                <h2 className="font-bold flex items-center gap-2 text-white">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Plus className="w-5 h-5 text-amber-500" />
                    </div>
                    <span>تعيين مهمة جديدة</span>
                </h2>

                <form action={assignTask} className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">اليوم</label>
                        <select name="dayId" defaultValue={selectedDayId || ''} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 outline-none focus:border-amber-500 transition-colors text-sm">
                            {days.map(d => (
                                <option key={d.id} value={d.id}>اليوم {d.dayNumber}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">اللاعب</label>
                        <select name="userId" defaultValue={selectedUserId || 'ALL'} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 outline-none focus:border-amber-500 transition-colors text-sm">
                            <option value="ALL">الجميع (4 لاعبين)</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.displayName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">نص المهمة</label>
                        <div className="flex gap-2">
                            <input
                                name="title" required
                                placeholder="مثال: قراءة الجزء الأول، حل اللغز..."
                                className="flex-1 bg-gray-950 border border-gray-800 rounded-lg p-3 outline-none focus:border-amber-500 transition-colors text-sm"
                            />
                            <button type="submit" className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-amber-900/20">
                                إضافة
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-900 border border-gray-800 rounded-xl w-fit">
                <div className="px-3 py-2 text-gray-500 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-bold">تصفية:</span>
                </div>

                {/* User Filter */}
                <div className="flex bg-gray-950 rounded-lg p-1 border border-gray-800">
                    <Link
                        href={`/admin/tasks?dayId=${selectedDayId || ''}&userId=ALL`}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${!selectedUserId || selectedUserId === 'ALL' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        الكل
                    </Link>
                    {users.map(u => (
                        <Link
                            key={u.id}
                            href={`/admin/tasks?dayId=${selectedDayId || ''}&userId=${u.id}`}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${selectedUserId === u.id ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            {u.displayName}
                        </Link>
                    ))}
                </div>

                {selectedDayId && (
                    <Link
                        href={`/admin/tasks?userId=${selectedUserId || ''}`}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs hover:bg-red-500/20 transition-colors"
                    >
                        <X className="w-3 h-3" />
                        <span>إلغاء فلتر اليوم</span>
                    </Link>
                )}
            </div>

            {/* Tasks List */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-right min-w-[600px]">
                    <thead className="bg-gray-950 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                        <tr>
                            <th className="p-4 font-medium sticky right-0 bg-gray-950">المهمة</th>
                            <th className="p-4 font-medium">اللاعب</th>
                            <th className="p-4 font-medium">اليوم</th>
                            <th className="p-4 font-medium">الحالة</th>
                            <th className="p-4 font-medium text-center">حذف</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <CheckCircle className="w-8 h-8 opacity-20" />
                                        <p>لا توجد مهام مطابقة للفلتر الحالي</p>
                                    </div>
                                </td>
                            </tr>
                        ) : tasks.map((task) => (
                            <tr key={task.id} className="group hover:bg-gray-800/30 transition-colors">
                                <td className="p-4 font-medium text-gray-200 sticky right-0 bg-gray-900 group-hover:bg-gray-800/30 transition-colors">{task.title}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-gray-400 border border-gray-700`}>
                                            {task.user.displayName?.[0]}
                                        </div>
                                        <span className="text-sm text-gray-300 whitespace-nowrap">{task.user.displayName}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Link href={`/admin/tasks?dayId=${task.day?.id}`} className="text-xs font-mono text-amber-500/80 hover:text-amber-500 bg-amber-500/5 px-2 py-1 rounded hover:bg-amber-500/10 transition-colors whitespace-nowrap">
                                        {task.day ? `اليوم ${task.day.dayNumber}` : 'مهمة عامة'}
                                    </Link>
                                </td>
                                <td className="p-4">
                                    <form action={toggleTaskComplete.bind(null, task.id, task.status === 'DONE' ? 'TODO' : 'DONE')}>
                                        <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${task.status === 'DONE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-500'}`}>
                                            {task.status === 'DONE' ? (
                                                <>
                                                    <CheckCircle className="w-3 h-3" />
                                                    <span>منجز</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Circle className="w-3 h-3" />
                                                    <span>قيد التنفيذ</span>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </td>
                                <td className="p-4 text-center">
                                    <form action={deleteTask.bind(null, task.id)}>
                                        <button className="text-gray-500 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
