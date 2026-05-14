import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Database,
  Download,
  FileCheck2,
  Layers3,
  Map,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StatCard } from "@/components/shared/StatCard";
import { demoLayerDetails } from "@/data/demo/layerDetails";
import { demoLayers } from "@/data/demo/layers";

const stats = [
  {
    value: `${demoLayers.length}`,
    label: "طبقات منشورة",
    hint: "طبقات جاهزة للاستعراض أو التنزيل حسب الصلاحيات.",
  },
  {
    value: "17",
    label: "تصنيفًا",
    hint: "بنية مناسبة لبيانات البلديات والبنية التحتية.",
  },
  {
    value: "GeoJSON / CSV",
    label: "صيغ MVP",
    hint: "مع فحص جودة أولي قبل الحفظ.",
  },
  {
    value: "RLS",
    label: "نموذج أمان",
    hint: "جاهز لسياسات Supabase وصلاحيات الأدوار.",
  },
];

const workstreams = [
  {
    title: "كتالوج موحد",
    text: "فهرسة الطبقات بالمصدر، الترخيص، النوع، تاريخ التحديث، وعدد السجلات.",
    icon: Database,
  },
  {
    title: "معاينة مكانية",
    text: "خريطة تشغيلية تدعم إظهار الطبقات وتعديل الشفافية والبحث داخل الخصائص.",
    icon: Map,
  },
  {
    title: "حوكمة وصول",
    text: "تمييز واضح بين البيانات المفتوحة والداخلية مع مسار إداري محمي.",
    icon: ShieldCheck,
  },
];

export function HomePage() {
  return (
    <section className="space-y-6">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="dark-panel rounded-lg p-7 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
            <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
              <Layers3 size={16} />
              مستودع بيانات جغرافية
            </span>
            <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
              <FileCheck2 size={16} />
              نسخة MVP قابلة للنشر
            </span>
          </div>

          <div className="mt-10 max-w-4xl">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              GeoData Hub
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-100">
              مركز تشغيل للبيانات الجغرافية يجمع الكتالوج، الخريطة، التحميل،
              وفحص جودة الملفات في واجهة واحدة مناسبة للفرق الهندسية والبلدية.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#007970]"
              to="/catalog"
            >
              استكشاف البيانات
              <ArrowLeft size={17} />
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/8 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/14"
              to="/map"
            >
              فتح الخريطة
              <Map size={17} />
            </Link>
          </div>
        </div>

        <div className="surface-strong rounded-lg p-5">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">مؤشر المستودع</h2>
              <p className="mt-1 text-sm text-slate-500">حالة البيانات التجريبية</p>
            </div>
            <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              نشط
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {demoLayerDetails.map((layer) => (
              <div
                className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3"
                key={layer.slug}
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">{layer.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{layer.category}</div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900">
                    {layer.recordsCount}
                  </div>
                  <div className="text-xs text-slate-500">سجل</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            hint={stat.hint}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      <section className="surface rounded-lg p-6">
        <div className="grid gap-7 lg:grid-cols-[360px_minmax(0,1fr)]">
          <SectionHeading
            title="واجهة تشغيل وليست صفحة عرض فقط"
            description="الصفحة الأولى تعطي صورة مباشرة عن حالة المستودع، مسارات العمل الأساسية، وأين يبدأ المستخدم: الكتالوج أو الخريطة أو الإدارة."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {workstreams.map((item) => {
              const Icon = item.icon;
              return (
                <article className="rounded-lg border border-slate-200 bg-white p-4" key={item.title}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-white">
                    <Icon size={18} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="surface-strong rounded-lg p-5">
          <div className="flex items-center gap-3">
            <Download className="text-[var(--accent)]" size={20} />
            <h2 className="text-lg font-bold text-slate-950">تحميل مضبوط</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            التنزيل مرتبط بحالة الترخيص والظهور العام، ومسار Supabase يضيف
            سياسات RLS لمنع الاعتماد على الواجهة وحدها.
          </p>
        </div>
        <div className="surface-strong rounded-lg p-5">
          <div className="flex items-center gap-3">
            <FileCheck2 className="text-[var(--accent)]" size={20} />
            <h2 className="text-lg font-bold text-slate-950">فحص قبل النشر</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            رفع GeoJSON وCSV يمر بفحص هندسة وعدد سجلات وإحداثيات قبل محاولة
            الحفظ أو النشر.
          </p>
        </div>
      </section>
    </section>
  );
}
