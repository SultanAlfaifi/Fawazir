import { verifySession } from '@/lib/session'
import { redirect, notFound } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import React from 'react'
import prisma from '@/lib/db'

export default async function CompetitionAdminLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{ code: string }>
}) {
    const session = await verifySession()
    if (session.role !== 'ADMIN') redirect('/app/competitions')

    const { code } = await params

    const competition = await prisma.competition.findUnique({
        where: { code },
        select: { title: true }
    })

    if (!competition) notFound()

    const navItems = [
        { name: 'الرئيسية', icon: 'LayoutDashboard', href: `/admin/competition/${code}` },
        { name: 'المحتوى والمهام', icon: 'Calendar', href: `/admin/competition/${code}/content` },
        { name: 'التقدم', icon: 'BarChart2', href: `/admin/competition/${code}/progress` },
        { name: 'الإشعارات', icon: 'Bell', href: `/admin/competition/${code}/notifications` },
        { name: 'الإعدادات', icon: 'Settings', href: `/admin/competition/${code}/settings` },
    ]

    return (
        <AdminShell
            session={session}
            customNavItems={navItems}
            title={competition.title}
            subtitle={`إدارة المسابقة (${code})`}
            backHref="/admin/competitions"
        >
            {children}
        </AdminShell>
    )
}
