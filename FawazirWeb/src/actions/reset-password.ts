'use server';

import prisma from '@/lib/db';
import { hashToken } from '@/lib/tokens';
import bcrypt from 'bcryptjs';

export async function resetPasswordAction(formData: FormData) {
    const token = formData.get('token') as string;
    const newPassword = formData.get('password') as string;

    if (!token || !newPassword) {
        return { error: 'البيانات غير مكتملة.' };
    }

    // Strong Password Validation Rules
    if (newPassword.length < 8) return { error: 'يجب أن لا تقل كلمة المرور عن 8 خانات.' };
    if (!/[A-Z]/.test(newPassword)) return { error: 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل.' };
    if (!/[a-z]/.test(newPassword)) return { error: 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل.' };
    if (!/[0-9]/.test(newPassword)) return { error: 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل.' };
    if (!/[^A-Za-z0-9]/.test(newPassword)) return { error: 'يجب أن تحتوي كلمة المرور على رمز واحد على الأقل.' };
    if (!/^[\x21-\x7E]+$/.test(newPassword)) return { error: 'يجب استخدام الأحرف الإنجليزية والرموز والمقاطع العادية فقط (بدون مسافات).' };

    try {
        const tokenHash = hashToken(token);

        const existingToken = await prisma.passwordResetToken.findUnique({
            where: { tokenHash }
        });

        if (!existingToken || existingToken.expiresAt < new Date()) {
            return { error: 'رابط استعادة كلمة المرور غير صالح أو منتهي الصلاحية.' };
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Transaction to update password and remove the token so it can't be reused
        await prisma.$transaction([
            prisma.user.update({
                where: { id: existingToken.userId },
                data: { passwordHash }
            }),
            prisma.passwordResetToken.delete({
                where: { id: existingToken.id }
            })
        ]);

        return { success: true };

    } catch (error) {
        console.error('Reset password error:', error);
        return { error: 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.' };
    }
}
