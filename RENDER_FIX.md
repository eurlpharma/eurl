# إصلاح مشكلة Render - المشروع يعمل محلياً لكن لا يعمل على Render

## المشكلة
المشروع يعمل بشكل طبيعي في البيئة المحلية، لكن يظهر خطأ 500 (Internal Server Error) على Render.

## الحلول

### 1. إعداد متغيرات البيئة في Render

اذهب إلى Render Dashboard → مشروعك → Environment Variables وأضف:

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=30d
API_URL=https://your-app-name.onrender.com
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

**مهم جداً**: تأكد من إضافة `DATABASE_URL` الصحيح من قاعدة البيانات PostgreSQL.

### 2. إعداد قاعدة البيانات PostgreSQL

1. في Render Dashboard، اذهب إلى "New" → "PostgreSQL"
2. أنشئ قاعدة بيانات جديدة
3. انسخ `DATABASE_URL` وأضفه إلى متغيرات البيئة
4. تأكد من أن الرابط يبدأ بـ `postgresql://` وليس `mysql://`

### 3. إعداد Build Command

في إعدادات Web Service، اضبط Build Command:

```bash
npm install && npx prisma generate && npx prisma db push
```

### 4. إعداد Start Command

```bash
npm start
```

### 5. إعداد قاعدة البيانات

بعد النشر، اذهب إلى Logs وتشغيل:

```bash
npm run db:seed
```

## خطوات مفصلة للإصلاح

### الخطوة 1: إنشاء قاعدة البيانات
1. اذهب إلى Render Dashboard
2. انقر على "New" → "PostgreSQL"
3. أدخل اسم قاعدة البيانات: `healthy_db`
4. اختر المنطقة الأقرب لك
5. انقر على "Create Database"
6. انسخ `DATABASE_URL`

### الخطوة 2: إعداد Web Service
1. اذهب إلى "New" → "Web Service"
2. اربط مستودع GitHub
3. اختر الفرع `main`
4. في Environment Variables أضف:
   - `DATABASE_URL` = الرابط الذي نسخته من قاعدة البيانات
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `JWT_SECRET` = مفتاح عشوائي طويل
   - `API_URL` = رابط تطبيقك على Render

### الخطوة 3: إعداد Build و Start Commands
- **Build Command**: `npm install && npx prisma generate && npx prisma db push`
- **Start Command**: `npm start`

### الخطوة 4: تشغيل Seeder
بعد النشر، اذهب إلى Logs وتشغيل:
```bash
npm run db:seed
```

## استكشاف الأخطاء

### إذا استمرت المشكلة:

1. **تحقق من Logs**: اذهب إلى Render Dashboard → مشروعك → Logs
2. **تحقق من قاعدة البيانات**: تأكد من أن قاعدة البيانات متصلة
3. **تحقق من المتغيرات**: تأكد من صحة جميع متغيرات البيئة

### رسائل الخطأ الشائعة:

- **"Database connection error"**: مشكلة في `DATABASE_URL`
- **"Prisma Client not generated"**: مشكلة في Build Command
- **"Table does not exist"**: مشكلة في تشغيل Seeder

## نصائح مهمة

1. **الملفات**: Render لا يحفظ الملفات محلياً، استخدم Cloudinary
2. **قاعدة البيانات**: تأكد من استخدام PostgreSQL وليس MySQL
3. **المتغيرات**: لا تشارك `DATABASE_URL` أو `JWT_SECRET` في الكود
4. **النسخ الاحتياطية**: قم بعمل نسخ احتياطية لقاعدة البيانات

## الأوامر المفيدة للتصحيح

```bash
# توليد Prisma Client
npx prisma generate

# دفع التغييرات لقاعدة البيانات
npx prisma db push

# تشغيل Seeder
npm run db:seed

# فتح Prisma Studio (محلياً فقط)
npx prisma studio
```

## إذا لم تعمل الحلول أعلاه

1. احذف Web Service من Render
2. احذف قاعدة البيانات
3. أعد إنشاء قاعدة البيانات PostgreSQL
4. أعد إنشاء Web Service مع الإعدادات الصحيحة
5. تأكد من تشغيل Seeder بعد النشر 