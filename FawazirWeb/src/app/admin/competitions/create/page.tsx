import { CreateCompetitionForm } from './CreateCompetitionForm'
import { verifySession } from '@/lib/session'
import AdminShell from '@/components/admin/AdminShell'

export default async function CreateCompetitionPage() {
    const session = await verifySession()

    return (
        <AdminShell session={session} backHref="/admin/competitions" title="مسابقة جديدة">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">إنشاء مسابقة جديدة</h1>
                    <p className="text-gray-500 font-medium mt-2">قم بإنشاء مساحة جديدة للتحدي وشارك الكود مع المتسابقين.</p>
                </div>

                <CreateCompetitionForm />
            </div>
        </AdminShell>
    )
}

