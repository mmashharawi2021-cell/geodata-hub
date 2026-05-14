# Open Data Sources

هذه القائمة هي سجل المصادر المفتوحة المدمجة في كتالوج GeoData Hub. الدمج الحالي يعتمد على metadata وروابط رسمية بدل نسخ الملفات الضخمة داخل المستودع.

## سياسة الدمج

- الملفات الصغيرة والمحلية فقط يمكن حفظها تحت `public/data` للمعاينة المباشرة على الخريطة.
- المصادر الضخمة مثل OSM وNASA وCopernicus وWorldPop وUSGS تبقى روابط رسمية حتى يتم تجهيز ETL إلى PostGIS أو Supabase Storage.
- كل مصدر خارجي يجب أن يحتوي على `sourceUrl` و`downloadUrl` و`licenseUrl` عند توفرها.
- لا يتم عرض زر معاينة على الخريطة إلا للطبقات التي لديها `previewGeoJsonUrl` محلي وصيغة هندسية `point | line | polygon`.

## المصادر الحالية

| المصدر | الاستخدام | التغطية | الترخيص/الملاحظة |
|---|---|---|---|
| Natural Earth | حدود، مدن، طبقات طبيعية | عالمي | Public Domain |
| OpenStreetMap via Geofabrik | طرق، مبان، POI، استخدامات أراضي | إسرائيل وفلسطين | ODbL 1.0 |
| OCHA HDX | حدود وبيانات إنسانية | فلسطين/عالمي | حسب مورد HDX |
| Palestine Open Data Portal | بيانات حكومية/وطنية | فلسطين | حسب مجموعة البيانات |
| WorldPop | سكان وكثافة | عالمي/حسب الدولة | غالبًا CC BY 4.0 |
| OurAirports | مطارات ومدارج | عالمي | Public Domain |
| USGS National Map | ارتفاعات، هيدرولوجيا، نقل | الولايات المتحدة | Public Domain غالبًا لمنتجات USGS |
| OpenTopography | DEM وLiDAR وارتفاعات | عالمي/إقليمي | حسب dataset مع citation |
| NASA Earthdata | استشعار عن بعد ومناخ | عالمي | وصول مفتوح مع citation |
| Copernicus Sentinel | مرئيات ورادار | عالمي | Free, full and open |
| OpenAerialMap | صور جوية مفتوحة | حسب التوفر | CC BY 4.0 / OIN |

## المرحلة التالية

1. إنشاء مهمة ETL اختيارية لتحويل ملفات `SHP/OSM PBF/GeoTIFF` إلى PostGIS.
2. توليد `preview_geojson` مبسط لكل طبقة كبيرة بدل تحميل الملف الأصلي في المتصفح.
3. إضافة جدول `external_sources` أو توسيع `layers` في Supabase بحقول المصدر والترخيص والتغطية.
