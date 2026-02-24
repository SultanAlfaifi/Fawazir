import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSession } from '@/lib/session';

// Initialize Gemini with System Prompt
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

        if (!process.env.GEMINI_API_KEY) {
            console.error('❌ Missing GEMINI_API_KEY');
            return NextResponse.json({ text: "عذراً يا رفيقي، يبدو أن أسرار قوتي مفقودة حالياً." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        let userContext = "";
        const session = await getSession();

        if (session?.userId) {
            userContext = `المستخدم الحالي: ${session.displayName} (${session.role})`;
        } else {
            userContext = "المستخدم زائر غير مسجل.";
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `${SULTANA_SYSTEM_PROMPT}\n\nسياق المستخدم الحالي:\n${userContext}`,
        });

        // Process history - messages come from client with properties: role, parts
        // Important: History must alternate between user and model
        let validHistory = (history || [])
            .filter((msg: any) => msg.role === 'user' || msg.role === 'assistant')
            .map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content || (msg.parts && msg.parts[0]?.text) || "" }]
            }));

        const chat = model.startChat({
            history: validHistory,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error('❌ Sultana/Gemini Error:', error);

        // Check for specific Gemini errors if possible
        if (error.message?.includes('429')) {
            return NextResponse.json({
                text: "عذراً يا رفيقي، لقد نفذ طاقتي لهذا الوقت. عد إليّ بعد قليل!"
            });
        }

        return NextResponse.json({
            text: "عذراً يا رفيقي، يبدو أن خيوط السحر قد تشابكت في تفكيري. حاول مرة أخرى!"
        });
    }
}
