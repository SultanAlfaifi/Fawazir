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
