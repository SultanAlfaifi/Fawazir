import { Sparkles, Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
            <div className="relative group">
                <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/40 transition-all duration-1000 animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-[#0D0D11] border border-white/5 flex items-center justify-center shadow-2xl">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                </div>
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-white tracking-widest flex items-center gap-3 justify-center">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    جاري التحميل
                </h3>
                <p className="text-gray-500 font-bold">نستعد لفتح لوحة التحكم الخاصة بك...</p>
            </div>
        </div>
    )
}
