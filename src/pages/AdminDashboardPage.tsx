import { Link } from "react-router-dom";
import { Database, Download, Layers3, Plus, ShieldCheck } from "lucide-react";
import { AnimatedPage } from "@/components/shared/AnimatedPage";
import { demoLayerDetails } from "@/data/demo/layerDetails";
import { LayerAnalyticsChart } from "@/features/admin/LayerAnalyticsChart";

const dashboardStats = [
  {
    label: "إجمالي الطبقات",
    value: `${demoLayerDetails.length}`,
    icon: Layers3,
  },
  {
    label: "الطبقات العامة",
    value: `${demoLayerDetails.filter((layer) => layer.isPublic).length}`,
    icon: ShieldCheck,
  },
  {
    label: "الطبقات الداخلية",
    value: `${demoLayerDetails.filter((layer) => !layer.isPublic).length}`,
    icon: Database,
  },
  {
    label: "إجمالي السجلات",
    value: `${demoLayerDetails.reduce((sum, layer) => sum + layer.recordsCount, 0)}`,
    icon: Download,
  },
];

export function AdminDashboardPage() {
  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
            لوحة الإدارة
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            متابعة الطبقات، الإحصاءات السريعة، والدخول إلى مسار رفع طبقة جديدة.
          </p>
        </div>
        <Link
          className="flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950"
          to="/admin/layers/new"
        >
          <Plus className="size-4" />
          إضافة طبقة جديدة
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article key={stat.label} className="surface-strong rounded-lg p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
                <span className="rounded-md bg-teal-50 p-2 text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
                  <Icon className="size-5" />
                </span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
                {stat.value}
              </div>
            </article>
          );
        })}
      </div>

      <section className="surface-strong rounded-lg p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              تحليل سريع للطبقات
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              ECharts يعرض توزيع السجلات وحالة الترخيص دون تحميل مكتبة UI ضخمة.
            </p>
          </div>
          <span className="rounded-md bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
            ECharts
          </span>
        </div>
        <div className="mt-4">
          <LayerAnalyticsChart layers={demoLayerDetails} />
        </div>
      </section>

      <section className="surface-strong rounded-lg p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            آخر الطبقات
          </h2>
          <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
            بيانات تجريبية
          </span>
        </div>
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
          {demoLayerDetails.map((layer) => (
            <article
              key={layer.slug}
              className="grid gap-3 border-b border-slate-200 bg-white px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_150px_130px] dark:border-white/10 dark:bg-white/5"
            >
              <div>
                <div className="font-semibold text-slate-950 dark:text-white">
                  {layer.name}
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {layer.category} • {layer.source}
                </div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {new Date(layer.updatedAt).toLocaleDateString("ar")}
              </div>
              <span className="w-fit rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                {layer.isPublic ? "عام" : "مقيد"}
              </span>
            </article>
          ))}
        </div>
      </section>
    </AnimatedPage>
  );
}
