'use client';

import { useState } from 'react';
import { deleteUser, getUserDetails } from './action';
import { Search, Filter, Trash2, CheckCircle, ShieldAlert, Loader2, UserX, AlertTriangle, X, Info, Trophy, Users, FileText, MessageSquare } from 'lucide-react';

type UserData = {
    id: string;
    email: string;
    role: string;
    displayName: string | null;
    createdAt: string;
    emailVerified: string | null;
    competitionsOwned: number;
    participations: number;
};

export default function UsersTable({ initialUsers }: { initialUsers: UserData[] }) {
    const [users, setUsers] = useState<UserData[]>(initialUsers);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'PLAYER'>('ALL');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Modal State
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: UserData | null }>({ isOpen: false, user: null });
    const [confirmWord, setConfirmWord] = useState('');

    const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean; userId: string | null }>({ isOpen: false, userId: null });
    const [userDetails, setUserDetails] = useState<any>(null);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);

    // Filtering logic (Super Fast Client-Side Filtering)
    const filteredUsers = users.filter(user => {
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const matchesSearch =
            (user.displayName?.toLowerCase().includes(search.toLowerCase()) || false) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        return matchesRole && matchesSearch;
    });

    function handleDeleteClick(user: UserData, e: React.MouseEvent) {
        e.stopPropagation(); // Prevent opening details modal when clicking delete
        setDeleteModal({ isOpen: true, user });
        setConfirmWord('');
        setErrorMsg(null);
    }

    async function handleRowClick(userId: string) {
        setDetailsModal({ isOpen: true, userId });
        setIsFetchingDetails(true);
        setUserDetails(null);
        const res = await getUserDetails(userId);
        if (res.success) {
            setUserDetails(res.user);
        } else {
            setErrorMsg(res.error || 'فشل جلب تفاصيل المستخدم');
            setTimeout(() => setErrorMsg(null), 5000);
            setDetailsModal({ isOpen: false, userId: null });
        }
        setIsFetchingDetails(false);
    }

    async function confirmDelete() {
        const user = deleteModal.user;
        if (!user) return;

        if (user.competitionsOwned > 0 && confirmWord !== "احذف") {
            setErrorMsg("تم إلغاء عملية الحذف لأن كلمة التأكيد غير مطابقة.");
            setTimeout(() => setErrorMsg(null), 4000);
            return;
        }

        setDeletingId(user.id);
        setErrorMsg(null);
        setDeleteModal({ isOpen: false, user: null });

        const res = await deleteUser(user.id);

        if (res.success) {
            setUsers(prev => prev.filter(u => u.id !== user.id));
        } else {
            setErrorMsg(res.error || 'فشل الحذف');
            setTimeout(() => setErrorMsg(null), 5000);
        }

        setDeletingId(null);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Control Panel */}
            <div className="bg-gray-900/60 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-2xl py-3 pr-12 pl-4 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-600 font-medium"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="bg-gray-950/50 border border-gray-800 p-1.5 rounded-2xl flex items-center">
                        <button
                            onClick={() => setRoleFilter('ALL')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${roleFilter === 'ALL' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setRoleFilter('PLAYER')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${roleFilter === 'PLAYER' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            لاعب
                        </button>
                        <button
                            onClick={() => setRoleFilter('ADMIN')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${roleFilter === 'ADMIN' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            مشرف
                        </button>
                    </div>
                </div>
            </div>

            {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in zoom-in-95">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Data Table */}
            <div className="bg-gray-900/40 border border-white/5 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden relative">
                {filteredUsers.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center gap-4 text-gray-500">
                        <UserX className="w-12 h-12 text-gray-700" />
                        <p className="font-bold text-lg">لم يتم العثور على أي مستخدمين</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-gray-950/80 text-gray-400 uppercase text-xs font-black tracking-widest border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-5 whitespace-nowrap">الاسم والبريد</th>
                                    <th className="px-6 py-5 whitespace-nowrap text-center">الدور</th>
                                    <th className="px-6 py-5 whitespace-nowrap text-center">حالة الحساب</th>
                                    <th className="px-6 py-5 whitespace-nowrap text-center">احصائيات</th>
                                    <th className="px-6 py-5 whitespace-nowrap text-center">تاريخ التسجيل</th>
                                    <th className="px-6 py-5 whitespace-nowrap text-left">إجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map(user => (
                                    <tr
                                        key={user.id}
                                        onClick={() => handleRowClick(user.id)}
                                        className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-white text-base truncate max-w-[200px]">{user.displayName || 'بلا اسم'}</span>
                                                <span className="text-gray-500 text-xs font-medium truncate max-w-[200px]" dir="ltr">{user.email}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${user.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            {user.emailVerified ? (
                                                <span className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-bold bg-blue-500/10 px-2.5 py-1 rounded-lg">
                                                    <CheckCircle className="w-3.5 h-3.5" /> مسجل
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs font-bold bg-gray-800/50 px-2.5 py-1 rounded-lg">
                                                    <ShieldAlert className="w-3.5 h-3.5" /> غير مؤكد
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-center text-xs font-medium text-gray-400 whitespace-nowrap">
                                            {user.role === 'ADMIN' ? (
                                                <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg">{user.competitionsOwned} مسابقات</span>
                                            ) : (
                                                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg">{user.participations} مشاركات</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className="text-gray-400 text-xs font-medium">
                                                {new Intl.DateTimeFormat('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(user.createdAt))}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-left">
                                            <button
                                                onClick={(e) => handleDeleteClick(user, e)}
                                                disabled={deletingId === user.id}
                                                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all disabled:opacity-30 active:scale-95 ${user.competitionsOwned > 0 ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white border border-amber-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20'}`}
                                                title={user.competitionsOwned > 0 ? "حذف مشرف بصلاحيات خطيرة" : "حذف الحساب نهائياً"}
                                            >
                                                {deletingId === user.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Custom Delete Modal */}
            {deleteModal.isOpen && deleteModal.user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setDeleteModal({ isOpen: false, user: null })}
                            className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center text-center gap-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${deleteModal.user.competitionsOwned > 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>
                                <AlertTriangle className="w-8 h-8" />
                            </div>

                            <div>
                                <h3 className="text-xl font-black text-white mb-2">
                                    {deleteModal.user.competitionsOwned > 0 ? 'تحذير أمني عالي!' : 'تأكيد الحذف النهائي'}
                                </h3>
                                <p className="text-sm text-gray-400 font-medium">
                                    {deleteModal.user.competitionsOwned > 0
                                        ? `هذا المشرف يدير ${deleteModal.user.competitionsOwned} مسابقات. حذفه سيؤدي إلى مسح كافّة مسابقاته، وإجابات لاعبيه، وكل نشاطاتهم للأبد!`
                                        : 'هل أنت متأكد من حذف هذا المستخدم والبيانات المرتبطة به بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.'}
                                </p>
                            </div>

                            {deleteModal.user.competitionsOwned > 0 && (
                                <div className="w-full mt-2">
                                    <label className="block text-sm font-bold text-gray-300 mb-2">لتأكيد الكارثة اكتب كلمة: <span className="text-amber-500 select-all">احذف</span></label>
                                    <input
                                        type="text"
                                        value={confirmWord}
                                        onChange={(e) => setConfirmWord(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 text-center text-white outline-none transition-all placeholder:text-gray-600"
                                        placeholder="اكتب هنا..."
                                        dir="rtl"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-3 w-full mt-4">
                                <button
                                    onClick={() => setDeleteModal({ isOpen: false, user: null })}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleteModal.user.competitionsOwned > 0 && confirmWord !== 'احذف'}
                                    className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${deleteModal.user.competitionsOwned > 0 ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20'}`}
                                >
                                    نعم، احذف فوراً
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {detailsModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">

                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-start justify-between bg-gray-900/50">
                            <div className="flex gap-4 items-center">
                                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                                    <Info className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white">تفاصيل المستخدم</h2>
                                    <p className="text-sm text-gray-400 font-medium">سجل وبطاقة البيانات الشاملة</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDetailsModal({ isOpen: false, userId: null })}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-gray-800 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {isFetchingDetails ? (
                                <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-4">
                                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                                    <p className="font-bold">جاري جلب المعلومات...</p>
                                </div>
                            ) : userDetails ? (
                                <div className="space-y-8">
                                    {/* Personal Info Card */}
                                    <div className="bg-gray-950 rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-right">
                                        {userDetails.avatar ? (
                                            <img src={userDetails.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-inner" style={{ backgroundColor: userDetails.color || '#3b82f6' }}>
                                                {userDetails.displayName ? userDetails.displayName.charAt(0) : userDetails.email.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-2 w-full">
                                            <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-start gap-2 w-full">
                                                <div>
                                                    <h3 className="text-2xl font-black text-white truncate max-w-[200px] sm:max-w-xs">{userDetails.displayName || 'بلا اسم'}</h3>
                                                    <p className="text-gray-400 font-medium text-sm truncate max-w-[200px] sm:max-w-xs">{userDetails.email}</p>
                                                </div>
                                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shrink-0 ${userDetails.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                                    {userDetails.role === 'ADMIN' ? 'مشرف مدير' : 'لاعب منافس'}
                                                </span>
                                            </div>
                                            {userDetails.bio && (
                                                <p className="text-gray-300 text-sm italic mt-2 bg-gray-900 p-3 rounded-xl border border-white/5">{userDetails.bio}</p>
                                            )}
                                            <div className="text-xs text-gray-500 font-bold mt-2">
                                                تاريخ التسجيل: <span className="text-gray-300">{new Intl.DateTimeFormat('ar-SA', { dateStyle: 'full' }).format(new Date(userDetails.createdAt))}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Counters Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
                                            <Trophy className="w-6 h-6 text-blue-400 mx-auto mb-2 opacity-50" />
                                            <div className="text-2xl font-black text-blue-400">{userDetails._count.myCompetitions}</div>
                                            <div className="text-xs font-bold text-blue-400/70 mt-1">مسابقات يملكها</div>
                                        </div>
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                                            <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2 opacity-50" />
                                            <div className="text-2xl font-black text-emerald-400">{userDetails._count.joinedCompetitions}</div>
                                            <div className="text-xs font-bold text-emerald-400/70 mt-1">مسابقات يلعبها</div>
                                        </div>
                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 text-center">
                                            <FileText className="w-6 h-6 text-purple-400 mx-auto mb-2 opacity-50" />
                                            <div className="text-2xl font-black text-purple-400">{userDetails._count.submissions}</div>
                                            <div className="text-xs font-bold text-purple-400/70 mt-1">إجابات أرسلها</div>
                                        </div>
                                        <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4 text-center">
                                            <MessageSquare className="w-6 h-6 text-pink-400 mx-auto mb-2 opacity-50" />
                                            <div className="text-2xl font-black text-pink-400">{userDetails._count.chatMessages}</div>
                                            <div className="text-xs font-bold text-pink-400/70 mt-1">رسائل محادثة</div>
                                        </div>
                                    </div>

                                    {/* Relation Lists */}
                                    {userDetails.role === 'ADMIN' && userDetails.myCompetitions.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-black text-gray-300 flex items-center gap-2">
                                                <Trophy className="w-4 h-4 text-amber-500" />
                                                المسابقات التي أنشأها كـ مدير:
                                            </h4>
                                            <div className="grid gap-2">
                                                {userDetails.myCompetitions.map((comp: any) => (
                                                    <div key={comp.id} className="bg-gray-950 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                                        <div>
                                                            <div className="font-bold text-amber-400 hover:underline cursor-pointer">{comp.title}</div>
                                                            <div className="text-xs text-gray-500 font-medium">كود الاشتراك: {comp.code}</div>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs font-bold">
                                                            <span className="bg-white/5 p-2 rounded-lg text-gray-300">{comp._count.participants} مشارك</span>
                                                            <span className="bg-white/5 p-2 rounded-lg text-gray-300">{comp._count.teams} فرقة</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {userDetails.joinedCompetitions.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-black text-gray-300 flex items-center gap-2">
                                                <Users className="w-4 h-4 text-emerald-500" />
                                                أماكن تواجده كلاعب (منضم عند المشرفين):
                                            </h4>
                                            <div className="grid gap-3">
                                                {userDetails.joinedCompetitions.map((joinInfo: any, idx: number) => (
                                                    <div key={idx} className="bg-gray-950 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <div className="font-bold text-emerald-400">{joinInfo.competition.title}</div>
                                                            <div className="text-xs text-gray-500 font-medium">فريقه: {joinInfo.team?.name || 'فردي'} | نقاطه: {joinInfo.totalScore} | نجومه: {joinInfo.stars}</div>
                                                        </div>

                                                        {joinInfo.competition.owner && (
                                                            <div className="flex items-center gap-3 bg-gray-900 p-2 rounded-xl border border-white/5 shrink-0" title="المشرف المسؤول عن المسابقة">
                                                                <div className="text-left hidden sm:block">
                                                                    <div className="text-[10px] text-gray-500 mb-0.5 font-bold">المشرف</div>
                                                                    <div className="text-xs font-black text-gray-300">{joinInfo.competition.owner.displayName}</div>
                                                                </div>
                                                                {joinInfo.competition.owner.avatar ? (
                                                                    <img src={joinInfo.competition.owner.avatar} alt="Admin" className="w-8 h-8 rounded-full border border-gray-700" />
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: joinInfo.competition.owner.color || '#3b82f6' }}>
                                                                        {joinInfo.competition.owner.displayName?.charAt(0) || 'م'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                <div className="py-10 text-center text-red-500 font-bold">فشل العثور على تفاصيل</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
