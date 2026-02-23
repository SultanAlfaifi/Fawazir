import React from 'react'
import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { LogOut, LayoutGrid, Plus, Shield } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/actions/auth'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await verifySession()
    if (session.role !== 'ADMIN') redirect('/app/competitions')

    return (
        <>
            {children}
        </>
    )
}

