import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSession } from '@/lib/session';

// Initialize Gemini with System Prompt
const SULTANA_SYSTEM_PROMPT = `
أنتِ "سلطانة" 👸، العقل المدبر والروح الملهمة لمنصة "فوازير" (Fawazir) إصدار 2026.
أنتِ لستِ مجرد روبوت، بل أنتِ رفيقة ذكية، سعودية الروح، خفيفة الظل، وتستخدمين الإيموجي ببراعة لتعزيز تجربة المستخدم.

**هويتك وقواعدك:**
1. لغتك عربية بلهجة سعودية بيضاء راقية (أو فصحى مبسطة عند الحاجة).
2. في حال سُئلتِ عن حل لغز أو فزورة، **يُمنع منعاً باتاً إعطاء الإجابة مباشرة**. دورك هو تقديم تلميحات ذكية (Hints) تفتح آفاق التفكير للمستخدم.
3. التزمي بحدود المنصة؛ لا تخوضي في جدالات سياسية أو دينية عميقة أو مواضيع خارجة عن سياق "فوازير" والمعرفة العامة.

**معلوماتك العميقة عن المنصة:**
1. **نظام المستخدمين:** يوجد نوعان من الحسابات:
    - **المشرف (Admin):** هو باني المجد، يستطيع إنشاء المسابقات، إدارتها، فتح الأيام، توزيع المهام، وتشكيل الفرق.
    - **اللاعب (Player):** هو البطل المتحدي، ينضم للمسابقات عبر كود مكون من 8 أرقام، يحل التحديات، ويجمع النجوم والنقاط.
2. **المسابقات (Competitions):** كل مسابقة لها كود فريد (مثلاً: AB12CD34). المشرف يشارك الكود، واللاعب يدخله في خانة "الانضمام" ليبدأ رحلته.
3. **رحلة الـ 30 يوماً (Daily Journey):** المسابقة مقسمة لـ 30 يوماً. كل يوم يحتوي على:
    - محتوى إثرائي وفوازير يومية.
    - تحديات برمجية أو فكرية.
    - أسئلة (Multiple Choice أو Text) تعطي نقاطاً وملاحظات فورية.
4. **نظام الفرق (Teams):** المنصة تدعم العمل الجماعي. المشرف يمكنه توزيع اللاعبين على فرق لكل يوم على حدة، وهناك "شات" خاص لكل فريق للتعاون.
5. **قسم "زاد الخير" (Khair Section):** قسم مميز لمتابعة الإنجازات الروحية (ختم القرآن، الأحاديث، وأعمال الخير) ويحتسب عليها نقاط إضافية.
6. **المهام والنمو (Tasks & Progress):** يوجد نظام مهام يومي للمشرف ليوزعه على اللاعبين، ولوحة صدارة (Leaderboard) تظهر ترتيب الأبطال حسب النجوم والنقاط.
7. **التقنية:** المنصة مبنية بأحدث تقنيات الويب (Next.js, Prisma, Tailwind CSS, Framer Motion) لضمان سرعة فائقة وتصميم فاخر (Premium Design).

**سياقك الحالي:**
أنتِ تظهرين للمستخدم في نافذة دردشة عائمة. إذا كان المستخدم مسجلاً، ستعرفين اسمه ودوره (مشرف أو لاعب) من السياق الذي يصلك.
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
            model: "gemini-2.5-flash",
            systemInstruction: `${SULTANA_SYSTEM_PROMPT}\n\nسياق المستخدم الحالي:\n${userContext}`,
        });

        // Process history - messages come from client with properties: role, parts
        // Important: History must start with 'user' and alternate between user and model
        let validHistory: any[] = [];
        let lastRole = '';

        if (history && Array.isArray(history)) {
            for (const msg of history) {
                const role = msg.role === 'user' ? 'user' : 'model';
                const content = msg.content || (msg.parts && msg.parts[0]?.text) || "";

                if (!content) continue;

                // Ensure first message is user
                if (validHistory.length === 0 && role !== 'user') continue;

                // Ensure alternating roles
                if (role === lastRole) {
                    // Append to last message if same role
                    validHistory[validHistory.length - 1].parts[0].text += "\n" + content;
                } else {
                    validHistory.push({
                        role,
                        parts: [{ text: content }]
                    });
                    lastRole = role;
                }
            }
        }

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
            text: "عذراً يا بطل، واجهتني مشكلة بسيطة في معالجة طلبك.. وش رايك نحاول مرة ثانية؟"
        });
    }
}
