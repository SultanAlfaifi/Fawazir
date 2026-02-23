# دليل تشغيل ورفع مشروع "فوازير سلطان 2026"

هذا الدليل يحتوي على الخطوات اللازمة لتشغيل المشروع محلياً أو وضعه على الويب (Production).

## المتطلبات الأساسية
- Node.js (الإصدار 18 أو أحدث)
- حساب في Neon.tech (لقاعدة البيانات)
- حساب في Vercel (للاستضافة)

## الإعداد المحلي (Development)
1. قم بنسخ ملف `.env.example` إلى ملف جديد باسم `.env`.
2. ضع رابط قاعدة البيانات من Neon في خانة `DATABASE_URL`.
3. قم بتوليد مفتاح سري للتشفير وضعه في `JWT_SECRET`.
4. قم بتشغيل الأوامر التالية:
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

## الرفع على Vercel (Production)
هذا المشروع مجهز للعمل مباشرة على Vercel بأقل مجهود:

1. **ارفع الكود على GitHub**: قم بإنشاء مستودع جديد وارفع الملفات.
2. **اربط المستودع بـ Vercel**:
   - أنشئ مشروعاً جديداً واختر المستودع.
   - في قسم **Environment Variables**، أضف:
     - `DATABASE_URL`: (رابط قاعدة البيانات من Neon).
     - `JWT_SECRET`: (أي نص طويل ومعقد للتشفير).
3. **الإعدادات التلقائية**:
   - المشروع سيقوم تلقائياً بتنفيذ `prisma generate` و `prisma migrate deploy` عند كل عملية رفع لضمان تحديث قاعدة البيانات.

## معلومات تقنية
- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
