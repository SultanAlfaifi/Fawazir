import 'server-only'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set')
}
const key = new TextEncoder().encode(process.env.JWT_SECRET)
const cookie = {
    name: 'session',
    options: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' },
    duration: 24 * 60 * 60 * 1000,
}

export async function encrypt(payload: JWTPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1day')
        .sign(key)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch {
        return null
    }
}

export async function createSession(userId: string, role: string, avatar: string, displayName: string) {
    const expires = new Date(Date.now() + cookie.duration)
    const session = await encrypt({ userId, role, avatar, displayName, expires })

    const cookieStore = await cookies()
    cookieStore.set(cookie.name, session, { ...cookie.options, expires })
}

export async function verifySession() {
    const cookieStore = await cookies()
    const session = cookieStore.get(cookie.name)?.value
    const payload = await decrypt(session)

    if (!payload?.userId) {
        redirect('/login')
    }

    return {
        isAuth: true,
        userId: String(payload.userId),
        role: String(payload.role),
        avatar: String(payload.avatar || ''),
        displayName: String(payload.displayName || '')
    }
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get(cookie.name)?.value
    const payload = await decrypt(session)
    return payload
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete(cookie.name)
}
