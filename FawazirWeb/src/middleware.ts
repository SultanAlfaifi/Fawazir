import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

// New Architecture:
// /login: Public
// /register: Public
// /app/competitions: Dashboard
// /admin/competitions: Admin Dashboard

const protectedRoutes = ['/app', '/admin']
const publicRoutes = ['/login', '/register', '/']

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
    const isPublicRoute = publicRoutes.includes(path)

    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // Redirect to dashboard if logged in and trying to access public auth pages
    if (isPublicRoute && session?.userId && path !== '/logout') {
        if (session.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/competitions', req.nextUrl))
        }
        return NextResponse.redirect(new URL('/app/competitions', req.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
