'use server';

import prisma from '@/lib/db';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/mail';

export async function forgotPasswordAction(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) {
        return { error: 'يرجى إدخال البريد الإلكتروني.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: 'صيغة البريد الإلكتروني غير صحيحة، تأكد من كتابته بشكل صحيح (مثل name@example.com).' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        // Return a specific error code if user doesn't exist so frontend can show register link
        if (!user) {
            return { error: 'NOT_FOUND' };
        }

        const token = await generatePasswordResetToken(user.id);
        const emailResult = await sendPasswordResetEmail(user.email, token);

        if (!emailResult.success) {
            console.error('Failed to send reset email:', emailResult.error);
            // Even if email fails, we might just return success or internal error.
            // Returning error here might be helpful for the user to try again later.
            return { error: 'حدث خطأ أثناء محاولة إرسال البريد الإلكتروني. يرجى المحاولة لاحقاً.' };
        }

        return { success: true };

    } catch (error: any) {
        console.error('Forgot password error:', error);
        // If it's a connection error, we should probably know
        if (error.code === 'P1001' || error.message?.includes('reach database')) {
            return { error: 'تعذر الاتصال بقاعدة البيانات. تأكد من اتصالك بالإنترنت وحالة الخادم.' };
        }
        return { error: 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.' };
    }
}
