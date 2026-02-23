'use server'

import { z } from 'zod'
import prisma from '@/lib/db'
import { verifySession, createSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

const profileSchema = z.object({
    displayName: z.string().min(2, "الاسم قصير جداً"),
    avatar: z.string().min(1, "يرجى اختيار رمز"),
    color: z.string().min(1, "يرجى اختيار لون"),
    bio: z.string().optional()
})

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await verifySession()

    const rawData = {
        displayName: formData.get('displayName'),
        avatar: formData.get('avatar'),
        color: formData.get('color'),
        bio: formData.get('bio')
    }

    const result = profileSchema.safeParse(rawData)

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    const { displayName, avatar, color, bio } = result.data

    await prisma.user.update({
        where: { id: session.userId },
        data: { displayName, avatar, color, bio }
    })

    // Update Session with new display data
    await createSession(session.userId, session.role, avatar, displayName)

    revalidatePath('/app/me')
    return { success: true, message: 'تم تحديث الملف الشخصي بنجاح' }
}
