insert into public.categories (name, slug, description)
values
  ('حدود إدارية', 'administrative-boundaries', 'حدود ومناطق إدارية'),
  ('طرق وشوارع', 'roads', 'شبكات الطرق والشوارع'),
  ('مدارس', 'schools', 'مرافق تعليمية'),
  ('مرافق عامة', 'public-facilities', 'مرافق وخدمات عامة'),
  ('أضرار ومسوحات ميدانية', 'field-surveys', 'نتائج حصر ومسوح ميدانية'),
  ('طرق ومباني ونقاط اهتمام', 'osm-features', 'طرق ومبان ونقاط اهتمام من مصادر مفتوحة'),
  ('بيانات إنسانية', 'humanitarian-data', 'بيانات OCHA وHDX والتنسيق الإنساني'),
  ('مصادر وطنية', 'national-open-data', 'بوابات بيانات وطنية ومصادر حكومية مفتوحة'),
  ('بيانات سكانية', 'population-data', 'سكان وكثافة ومؤشرات ديموغرافية'),
  ('مطارات ونقل', 'transport-airports', 'مطارات ونقل وشبكات حركة'),
  ('تضاريس وارتفاعات', 'elevation-terrain', 'DEM وارتفاعات وهيدرولوجيا'),
  ('صور جوية ومرئيات', 'imagery', 'مرئيات فضائية وصور جوية مفتوحة'),
  ('بيانات بيئية', 'environmental-data', 'أنهار وبحيرات وغطاء أرضي وبيئة')
on conflict (slug) do nothing;

insert into public.data_sources (name, description)
values
  ('البلدية', 'مصدر رسمي للطبقات الإدارية والخدمية'),
  ('دائرة الأشغال', 'مصدر طبقات الطرق والبنية التحتية'),
  ('وزارة التربية', 'مصدر بيانات المرافق التعليمية'),
  ('Natural Earth', 'بيانات GIS عالمية Public Domain للخرائط المرجعية'),
  ('Geofabrik / OpenStreetMap', 'استخراجات OSM جاهزة للتحميل بصيغ PBF وSHP'),
  ('OCHA HDX', 'منصة Humanitarian Data Exchange للبيانات الإنسانية المفتوحة'),
  ('Palestine Open Data Portal', 'بوابة بيانات مفتوحة وطنية مبنية على CKAN'),
  ('WorldPop', 'طبقات سكانية شبكية عالية الدقة'),
  ('OurAirports', 'جداول مطارات ومدارج عالمية مفتوحة'),
  ('U.S. Geological Survey', 'مصادر USGS National Map الرسمية'),
  ('OpenTopography', 'بوابة وAPI للارتفاعات وDEM وLiDAR المفتوحة'),
  ('NASA Earthdata', 'بيانات استشعار عن بعد ومناخ من NASA'),
  ('Copernicus / ESA', 'بيانات Sentinel ضمن Copernicus'),
  ('OpenAerialMap / HOT', 'صور جوية ودرون مفتوحة من OAM/HOT')
on conflict (name) do nothing;
