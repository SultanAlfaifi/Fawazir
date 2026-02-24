import { Resend } from 'resend'

export async function sendVerificationEmail(email: string, token: string) {
    // Explicitly using the requested sender address
    const baseUrl = "https://fawazir.com"
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = "Fawazir <hello@mail.fawazir.com>"

    const confirmLink = `${baseUrl}/verify?token=${token}`

    if (!apiKey) {
        console.error('❌ Missing RESEND_API_KEY in environment variables');
        return { success: false, error: 'Email configuration missing' };
    }

    if (!fromEmail) {
        console.error('❌ Missing RESEND_FROM_EMAIL in environment variables');
        return { success: false, error: 'Sender email configuration missing' };
    }

    const resend = new Resend(apiKey)

    try {
        console.log('📬 Attempting to send verification email:');
        console.log(`📤 From: ${fromEmail}`);
        console.log(`📥 To: ${email}`);
        console.log(`🔗 Link: ${confirmLink}`);

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: 'رابط تفعيل حساب فوازير',
            html: `
                <div dir="rtl" style="font-family: sans-serif; background-color: #f4f4f7; padding: 40px 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e1e1e1;">
                        <tr>
                            <td style="padding: 40px 30px; text-align: center;">
                                <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">مرحباً بك في فوازير! ✨</h1>
                                <p style="color: #4a4a4a; font-size: 16px; margin-bottom: 30px;">أنت على بعد خطوة واحدة من دخول عالم التحديات. اضغط على الزر أدناه لتفعيل حسابك والبدء في المغامرة.</p>
                                
                                <a href="${confirmLink}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                    تفعيل الحساب الآن
                                </a>
                                
                                <div style="margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                                    <p style="color: #999999; font-size: 12px;">أو انسخ الرابط التالي إلى متصفحك:</p>
                                    <p style="color: #f59e0b; font-size: 12px; word-break: break-all;">${confirmLink}</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div style="text-align: center; margin-top: 20px; color: #999999; font-size: 12px;">
                        فوازير - تحدي وذكاء
                    </div>
                </div>
            `,
            text: `مرحباً بك في فوازير!\n\nلتفعيل حسابك، يرجى زيارة الرابط التالي:\n${confirmLink}`
        })

        if (error) {
            console.error('❌ Resend API Error:', JSON.stringify(error, null, 2));
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('❌ Suddenly Email error:', error)
        return { success: false, error }
    }
}


