import { CreateCompetitionForm } from './CreateCompetitionForm'
import { verifySession } from '@/lib/session'
import AdminShell from '@/components/admin/AdminShell'

export default async function CreateCompetitionPage() {
    const session = await verifySession()

    return (
        <AdminShell session={session} backHref="/admin/competitions">
            <div className="max-w-4xl mx-auto space-y-12 pb-20">
                <div className="text-center space-y-4 pt-10">
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">إطلاق تحدٍ جديد</h1>
                    <p className="text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
                        اختر اسماً حماسياً لمسابقتك وابدأ بجمع المتحدين في نظام فوازير المعتمد.
                    </p>
                </div>

                <CreateCompetitionForm />
            </div>
        </AdminShell>
    )
}

