# دليل نشر فوازير سلطان 2026 🚀

## المتطلبات الأساسية
قبل البدء، تأكد من توفر ما يلي:
1. **GitHub Account**: يجب أن يكون لديك حساب على [GitHub](https://github.com).
2. **Vercel Account**: قم بإنشاء حساب على [Vercel](https://vercel.com) واربطه بحساب GitHub الخاص بك.
3. **Database**: يجب أن يكون لديك قاعدة بيانات PostgreSQL (مثل Neon.tech أو Supabase).
4. **Gemini API Key**: مفتاح API من [Google AI Studio](https://aistudio.google.com).

## الخطوة 1: رفع المشروع إلى GitHub
1. أنشئ مستودع (Repository) جديد في GitHub باسم `fawazir-sultan-2026`.
2. في جهازك، افتح الطرفية (Terminal) في مجلد المشروع ونفذ الأوامر التالية:
   ```bash
   git init
   git add .
   git commit -m "الإصدار الأول الجاهز للنشر"
   git branch -M main
   git remote add origin https://github.com/USERNAME/fawazir-sultan-2026.git
   git push -u origin main
   ```
   *(استبدل `USERNAME` باسم حسابك في GitHub)*.

## الخطوة 2: النشر على Vercel
1. اذهب إلى [لوحة تحكم Vercel](https://vercel.com/dashboard) واضغط **Add New Project**.
2. اختر `Import Git Repository` واختر مشروع `fawazir-sultan-2026` الذي رفعته للتو.
3. في إعدادات النشر **Configure Project**:
   - **Framework Preset**: سيتم التعرف عليه تلقائياً كـ `Next.js`.
   - **Root Directory**: اتركه كما هو `./`.
   - **Environment Variables**: أضف المتغيرات التالية (مهم جداً!):
     - `DATABASE_URL`: رابط الاتصال بقاعدة البيانات.
     - `GEMINI_API_KEY`: مفتاح الذكاء الاصطناعي.
     - `JWT_SECRET`: (اختياري) مفتاح عشوائي طويل لتشفير الجلسات.
4. اضغط **Deploy**.

## الخطوة 3: تهيئة قاعدة البيانات
بعد نجاح النشر، قد تحتاج لتجهيز قاعدة البيانات (Seed) لأول مرة:
1. شغل نفس أوامر الـ Seed محلياً وتأكد من اتصالك بقاعدة البيانات السحابية (Cloud DB) بتعديل `.env` مؤقتاً.
2. أو يمكنك استخدام واجهة Vercel Storage إذا كنت تستخدمها.
3. تأكد من تشغيل `npx prisma db push` لتحديث هيكلية الجداول.

## مبروك! 🎉
الآن موقعك يعمل أونلاين ويمكنك مشاركة الرابط مع الجميع!
