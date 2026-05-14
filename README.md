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
