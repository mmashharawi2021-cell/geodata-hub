insert into public.categories (name, slug, description)
values
  ('حدود إدارية', 'administrative-boundaries', 'حدود ومناطق إدارية'),
  ('طرق وشوارع', 'roads', 'شبكات الطرق والشوارع'),
  ('مدارس', 'schools', 'مرافق تعليمية'),
  ('مرافق عامة', 'public-facilities', 'مرافق وخدمات عامة'),
  ('أضرار ومسوحات ميدانية', 'field-surveys', 'نتائج حصر ومسوح ميدانية')
on conflict (slug) do nothing;

insert into public.data_sources (name, description)
values
  ('البلدية', 'مصدر رسمي للطبقات الإدارية والخدمية'),
  ('دائرة الأشغال', 'مصدر طبقات الطرق والبنية التحتية'),
  ('وزارة التربية', 'مصدر بيانات المرافق التعليمية')
on conflict (name) do nothing;
