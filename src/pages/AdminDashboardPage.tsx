import { Link } from "react-router-dom";
import { Database, Download, Layers3, Plus, ShieldCheck } from "lucide-react";
import { AnimatedPage } from "@/components/shared/AnimatedPage";
import { demoLayerDetails } from "@/data/demo/layerDetails";
import { LayerAnalyticsChart } from "@/features/admin/LayerAnalyticsChart";

const dashboardStats = [
  {
    label: "إجمالي الطبقات",
    get value() { return `${demoLayerDetails.length}`; },
    icon: Layers3,
  },
  {
    label: "الطبقات العامة",
    get value() { return `${demoLayerDetails.filter((layer) => layer.isPublic).length}`; },
    icon: ShieldCheck,
  },
  {
    label: "الطبقات الداخلية",
    get value() { return `${demoLayerDetails.filter((layer) => !layer.isPublic).length}`; },
    icon: Database,
  },
  {
    label: "إجمالي السجلات",
    get value() { return `${demoLayerDetails.reduce((sum, layer) => sum + layer.recordsCount, 0)}`; },
    icon: Download,
  },
];

export function AdminDashboardPage() {
  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            لوحة الإدارة
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            متابعة الطبقات، الإحصاءات السريعة، والدخول إلى مسار رفع طبقة جديدة.
          </p>
        </div>
        <Link
          className="btn-primary"
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
            <article key={stat.label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-[var(--muted)]">
                  {stat.label}
                </div>
                <span className="badge badge-accent p-2">
                  <Icon className="size-4" />
                </span>
              </div>
              <div className="mt-3 text-3xl font-bold text-[var(--foreground)]">
                {stat.value}
              </div>
            </article>
          );
        })}
      </div>

      <section className="glass-panel-strong rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              تحليل سريع للطبقات
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              توزيع السجلات وحالة الترخيص عبر ECharts.
            </p>
          </div>
          <span className="badge badge-primary">ECharts</span>
        </div>
        <div className="mt-4">
          <LayerAnalyticsChart layers={demoLayerDetails} />
        </div>
      </section>

      <section className="glass-panel-strong rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            آخر الطبقات
          </h2>
          <span className="badge">بيانات تجريبية</span>
        </div>
        <div className="mt-5 space-y-2">
          {demoLayerDetails.map((layer) => (
            <article
              key={layer.slug}
              className="glass-card flex items-center justify-between rounded-xl px-4 py-3 gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[var(--foreground)]">
                  {layer.name}
                </div>
                <div className="mt-0.5 text-sm text-[var(--muted)]">
                  {layer.category} &bull; {layer.source}
                </div>
              </div>
              <div className="text-sm text-[var(--muted)] shrink-0">
                {new Date(layer.updatedAt).toLocaleDateString("ar")}
              </div>
              <span className={`badge shrink-0 ${layer.isPublic ? "badge-accent" : "badge-copper"}`}>
                {layer.isPublic ? "عام" : "مقيد"}
              </span>
            </article>
          ))}
        </div>
      </section>
    </AnimatedPage>
  );
}
