import { Link } from "react-router-dom";
import { Map, Database, Layers3, LayoutGrid, Download, ArrowLeft } from "lucide-react";
import { env } from "@/lib/env";

const FEATURES = [
  {
    title: "كتالوج رقمي",
    description: "تصفح ومقارنة الطبقات المكانية ببيانات وصفية دقيقة.",
    icon: Database,
  },
  {
    title: "خريطة تفاعلية",
    description: "استعرض الطبقات مباشرة على خريطة مفتوحة المصدر.",
    icon: Map,
  },
  {
    title: "إدارة متقدمة",
    description: "أضف وعدّل ورتب الطبقات عبر لوحة تحكم شاملة.",
    icon: Layers3,
  },
  {
    title: "تنزيل سلس",
    description: "احصل على البيانات بأكثر من تنسيق بنقرة واحدة.",
    icon: Download,
  },
];

const STATS = [
  { label: "طبقة بيانات", value: "١٢٠+" },
  { label: "مصدر معتمد", value: "١٨" },
  { label: "مستخدم نشط", value: "٢,٤٠٠+" },
];

export function HomePage() {
  const { isDemoMode } = env;

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="hero-panel rounded-3xl p-6 sm:p-10 lg:p-14">
            <div className="hero-glow-1" />
            <div className="hero-glow-2" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="badge badge-primary text-[0.65rem]">
                    إصدار v٢.٠
                  </span>
                  {isDemoMode && (
                    <span className="badge badge-amber text-[0.65rem]">
                      تجريبي
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                  منصة إدارة
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#22d3ee] via-[#38bdf8] to-[#22d3ee]">
                    البيانات المكانية
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#94b8d0] leading-relaxed max-w-xl mr-auto">
                  منصة رقمية متكاملة لإدارة وتوزيع بيانات GIS في ليبيا — بواجهة عربية حديثة وتقنيات مفتوحة المصدر.
                </p>

                <div className="flex flex-wrap gap-3 justify-end">
                  <Link to="/catalog" className="btn-primary">
                    <ArrowLeft className="w-5 h-5" />
                    استعرض الكتالوج
                  </Link>
                  <Link to="/map" className="btn-ghost border-white/15 text-white/80 hover:text-white hover:bg-white/5">
                    <Map className="w-5 h-5" />
                    افتح الخريطة
                  </Link>
                </div>

                <div className="flex flex-wrap gap-6 justify-end pt-4">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                      <p className="text-xs text-[#94b8d0]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Visual Mockup */}
              <div className="hidden lg:block relative">
                <div className="relative rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-sm p-5 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(34,211,238,0.03)] to-transparent pointer-events-none" />
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="h-1.5 rounded-full bg-white/10" />
                    <div className="h-1.5 rounded-full bg-white/10 w-2/3" />
                    <div className="h-1.5 rounded-full bg-[#22d3ee]/30 w-1/2" />
                  </div>

                  {/* Mock Map */}
                  <div className="relative rounded-xl bg-[rgba(0,0,0,0.25)] h-44 mb-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[rgba(34,211,238,0.06)] to-[rgba(11,114,133,0.12)]" />
                    <div className="absolute bottom-2 right-2 left-2 grid grid-cols-4 gap-1.5">
                      <div className="h-1 rounded bg-[rgba(34,211,238,0.2)]" />
                      <div className="h-1 rounded bg-[rgba(34,211,238,0.15)]" />
                      <div className="h-1 rounded bg-[rgba(34,211,238,0.3)]" />
                      <div className="h-1 rounded bg-[rgba(34,211,238,0.1)]" />
                    </div>
                  </div>

                  {/* Data indicators */}
                  <div className="space-y-2">
                    <div className="glass-card rounded-xl p-3 !border-white/5 !bg-[rgba(255,255,255,0.04)]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="badge badge-primary text-[0.55rem]">جديد</span>
                        <span className="text-[0.6rem] text-[#94b8d0]">منذ ساعة</span>
                      </div>
                      <p className="text-sm font-bold text-white/90">الطرق الرئيسية</p>
                      <p className="text-[0.65rem] text-[#94b8d0]">٣٢٠ kB · GeoJSON</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="glass-card rounded-xl p-2.5 flex-1 !border-white/5 !bg-[rgba(255,255,255,0.03)]">
                        <p className="text-[0.6rem] text-[#94b8d0]">طبقات اليوم</p>
                        <p className="text-sm font-bold text-white/90">٨</p>
                      </div>
                      <div className="glass-card rounded-xl p-2.5 flex-1 !border-white/5 !bg-[rgba(255,255,255,0.03)]">
                        <p className="text-[0.6rem] text-[#94b8d0]">حجم البيانات</p>
                        <p className="text-sm font-bold text-white/90">٢.٤ GB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold">أبرز المميزات</h2>
            <p className="text-sm text-[var(--muted)] mt-2 max-w-xl mx-auto">
              أدوات مفتوحة ومتكاملة لإدارة البيانات المكانية بسهولة.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ title, description, icon: Icon }) => (
              <div key={title} className="glass-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)] flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-[#22d3ee]" />
                </div>
                <h3 className="text-base font-bold mb-1.5">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="hero-panel rounded-3xl p-8 sm:p-12 text-center">
            <div className="hero-glow-1" />
            <div className="hero-glow-2" />
            <div className="relative z-10 max-w-xl mx-auto space-y-5">
              <LayoutGrid className="w-10 h-10 mx-auto text-[#22d3ee]/60" />
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                مستعد لاستكشاف البيانات؟
              </h2>
              <p className="text-[#94b8d0]">
                ابدأ بتصفح الكتالوج أو افتح الخريطة التفاعلية مباشرة.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/catalog" className="btn-amber">
                  <ArrowLeft className="w-5 h-5" />
                  ابدأ الاستكشاف
                </Link>
                <Link to="/map" className="btn-ghost border-white/15 text-white/80 hover:text-white hover:bg-white/5">
                  <Map className="w-5 h-5" />
                  افتح الخريطة
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
