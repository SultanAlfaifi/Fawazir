import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

// Fix for Node.js environment to use WebSockets correctly with Neon
if (typeof window === 'undefined') {
    neonConfig.webSocketConstructor = ws
}

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        throw new Error('DATABASE_URL is not defined')
    }

    // In development, we use the standard Prisma driver which is more stable for local networks
    // and bypasses WebSocket (WSS) timeout issues.
    if (process.env.NODE_ENV === 'development') {
        return new PrismaClient({
            log: ['error', 'warn'],
        })
    }

    // Production (Serverless/Vercel) uses the Neon adapter for optimized performance
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool as any)
    return new PrismaClient({
        adapter: adapter as any,
        log: ['error', 'warn'],
    } as any)
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
