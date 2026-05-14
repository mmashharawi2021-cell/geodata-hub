# GeoData Hub

منصة Web GIS عربية لإدارة واستعراض وتحميل البيانات الجغرافية. النسخة الحالية هي MVP عملي مبني على React وMapLibre وSupabase/PostGIS، وتعمل محليًا بوضع demo عند عدم ضبط مفاتيح Supabase.

## التشغيل المحلي

```bash
npm install
npm run dev
```

## الفحص

```bash
npm run test -- --run
npm run lint
npm run build
```

## مكتبات الواجهة المعتمدة

- Tailwind CSS: نظام التصميم الأساسي، RTL، Responsive، وDark/Light Mode.
- Framer Motion: انتقالات خفيفة على مستوى الصفحات بدون إبطاء الخريطة.
- ECharts: رسوم تحليلية داخل لوحة الإدارة للطبقات والسجلات والتراخيص.
- Lucide React: الأيقونات الأساسية للخرائط والطبقات والإدارة.
- Fontsource Cairo: خط عربي محلي عبر npm بدل الاعتماد على تحميل خارجي من Google Fonts.
- Theme Provider مخصص: زر تبديل Dark/Light Mode محفوظ محليًا في المتصفح.

تم استبعاد Bootstrap وMUI وChakra وAnt Design من هذه النسخة لأن جمعها مع Tailwind يسبب تضاربًا بصريًا وحجمًا زائدًا. يمكن إضافة Ant Design لاحقًا فقط إذا تحولت لوحة الإدارة إلى نظام جداول وعمليات مؤسسية أكبر.

## إعداد Supabase

1. أنشئ مشروع Supabase مجاني.
2. افتح SQL Editor وشغّل `supabase/migrations/20260514_001_initial_schema.sql`.
3. شغّل `supabase/seed.sql` لإضافة التصنيفات والمصادر الأساسية.
4. انسخ `.env.example` إلى `.env.local`.
5. أضف القيم:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

لا تضع Service Role Key في الواجهة.

## النشر على Vercel

1. ارفع المستودع إلى GitHub.
2. اربطه بـ Vercel.
3. أضف متغيرات البيئة `VITE_SUPABASE_URL` و`VITE_SUPABASE_ANON_KEY`.
4. استخدم أمر البناء الافتراضي:

```bash
npm run build
```

ملف `vercel.json` يضبط إعادة التوجيه حتى تعمل روابط React Router المباشرة.

## حدود MVP

- المدعوم الآن: GeoJSON وCSV مع Lat/Lng.
- الخريطة تستخدم MapLibre GL JS مع طبقات معاينة GeoJSON.
- حفظ الطبقات على Supabase يتطلب ضبط البيئة وتطبيق سياسات RLS.
- صيغ KML وKMZ وShapefile وExcel مؤجلة للمرحلة التالية.
