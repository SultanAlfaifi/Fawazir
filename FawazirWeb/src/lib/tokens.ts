import crypto from 'node:crypto'
import prisma from './db'

/**
 * Generates a secure random token, hashes it, and stores it in the database.
 * Returns the raw token to be sent in the email.
 */
export async function generateVerificationToken(userId: string, ip?: string, userAgent?: string) {
    // Generate 32 bytes of random data
    const rawToken = crypto.randomBytes(32).toString('hex')

    // Create SHA-256 hash of the token for storage
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

    // Set expiry (30 minutes from now)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30)

    // Store in database
    await prisma.emailVerification.create({
        data: {
            userId,
            tokenHash,
            expiresAt,
            ip,
            userAgent
        },
    })

    return rawToken
}

/**
 * Hashes a token using SHA-256 for verification
 */
export function hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Generates a secure random token for password reset
 */
export async function generatePasswordResetToken(userId: string, ip?: string, userAgent?: string) {
    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

    // Expires in 15 minutes
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15)

    // Remove any existing active reset tokens for this user for security
    await prisma.passwordResetToken.deleteMany({
        where: { userId }
    });

    await prisma.passwordResetToken.create({
        data: {
            userId,
            tokenHash,
            expiresAt,
            ip,
            userAgent
        },
    })

    return rawToken
}
