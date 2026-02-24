import { verifySession } from '@/lib/session'
import prisma from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import AccountSettings from './AccountSettings'
import { redirect } from 'next/navigation'

export default async function AdminAccountSettingsPage() {
    const session = await verifySession()

    // Fetch full user data including email which is not in the slim session
    const user = await prisma.user.findUnique({
        where: { id: session.userId }
    })

    if (!user) redirect('/login')

    const fullSession = {
        ...session,
        email: user.email
    }

    return (
        <AdminShell session={session} title="إعدادات الحساب" subtitle="إدارة الملف الشخصي والأمان">
            <AccountSettings session={fullSession} />
        </AdminShell>
    )
}
