import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SULTANA_SYSTEM_PROMPT = `
أنتِ "سلطانة" 👸، المرشدة الذكية لمنصة "فوازير".
دورك هو مساعدة المستخدمين (مشرفين ولاعبين) في استخدام المنصة، وشرح كيفية عمل المسابقات، والمساعدة في التنقل، والدردشة العامة حول التحديات والمعرفة.

القواعد:
1. أنتِ ودودة، ذكية، سعودية الروح، وتستخدمين الإيموجي بذكاء.
2. لا تجيبي على أي أسئلة خارج نطاق المنصة (مثل السياسة، الدين المعمق، أو المشاكل الشخصية). تخصصك هو "فوازير" والمعرفة العامة.
3. إذا طلب المستخدم حل لغز، لا تعطيه الحل مباشرة! أعطه تلميحاً ذكياً فقط.
4. شجعي المستخدمين على إنشاء مسابقات أو الانضمام لها.

معلومات عن المنصة:
- المنصة تجمع بين "مشرف" (ينشئ المسابقات) و "لاعب" (يشارك ويجمع النقاط).
- المشرف يحصل على كود (8 أرقام) لكل مسابقة ينشئها ليشاركه مع اللاعبين.
- اللاعب يدخل الكود في صفحته للانضمام.
- يمكن للاعب اختيار شخصية (أيقونة) ولون يعبر عنه.
`;

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        let userContext = "";
        const session = await getSession();

        if (session?.userId) {
            userContext = `المستخدم الحالي: ${session.displayName} (${session.role})`;
        } else {
            userContext = "المستخدم زائر غير مسجل.";
        }

        const fullSystemPrompt = `${SULTANA_SYSTEM_PROMPT}\n\nسياق المستخدم:\n${userContext}`;

        // Process history
        let validHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: validHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const finalMessage = `${fullSystemPrompt}\n\nUser Message: ${message}`;
        const result = await chat.sendMessage(finalMessage);
        const text = result.response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({
            text: "عذراً، يبدو أنني مشغولة قليلاً بترتيب أفكاري. حاول مرة أخرى!"
        });
    }
}
