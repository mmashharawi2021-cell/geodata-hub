import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StatCard } from "@/components/shared/StatCard";
import { demoLayers } from "@/data/demo/layers";

const stats = [
  {
    value: `${demoLayers.length}`,
    label: "طبقات منشورة",
    hint: "طبقات جاهزة للاستعراض أو التنزيل العام.",
  },
  {
    value: "17",
    label: "تصنيفًا أساسيًا",
    hint: "بنية مرنة لحدود، طرق، مرافق، ومسوح ميدانية.",
  },
  {
    value: "9",
    label: "ملفات قابلة للتنزيل",
    hint: "تنزيلات محكومة بحسب الترخيص والصلاحيات.",
  },
  {
    value: "12 مايو 2026",
    label: "آخر تحديث",
    hint: "مؤشر سريع لحداثة البيانات المنشورة.",
  },
];

const categories = [
  "حدود إدارية",
  "طرق وشوارع",
  "مرافق عامة",
  "مدارس",
  "مشاريع إعمار",
  "أضرار ومسوحات ميدانية",
];

export function HomePage() {
  return (
    <section className="space-y-10">
      <section className="overflow-hidden rounded-[2.5rem] border border-white/14 bg-slate-950/45 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl sm:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100">
              مستودع GIS مؤسسي
            </span>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                GeoData Hub
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-200">
                منصة مركزية رسمية لتنظيم وعرض وتحميل البيانات الجغرافية، مع
                كتالوج واضح وخريطة تفاعلية وصلاحيات وصول مناسبة للجهات
                والمؤسسات والفرق الميدانية.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300"
                to="/catalog"
              >
                استكشاف البيانات
              </Link>
              <Link
                className="rounded-full border border-white/16 px-6 py-3 text-base font-medium text-white transition hover:bg-white/10"
                to="/map"
              >
                فتح الخريطة
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                hint={stat.hint}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-[2rem] border border-white/12 bg-white/8 p-7 backdrop-blur-xl dark:bg-slate-950/30">
          <SectionHeading
            title="منصة واحدة بدل الملفات المتفرقة"
            description="تجمع GeoData Hub الطبقات والملفات الوصفية والمصادر وحقوق الاستخدام في واجهة واحدة قابلة للبحث والمعاينة، بدل بقائها موزعة بين روابط وملفات وأجهزة منفصلة."
          />
        </div>
        <div className="rounded-[2rem] border border-white/12 bg-slate-950/45 p-7 backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">تصنيفات محورية</h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-slate-200"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
