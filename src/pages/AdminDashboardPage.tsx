import { Link } from "react-router-dom";
import { demoLayerDetails } from "@/data/demo/layerDetails";

const dashboardStats = [
  {
    label: "إجمالي الطبقات",
    value: `${demoLayerDetails.length}`,
  },
  {
    label: "الطبقات العامة",
    value: `${demoLayerDetails.filter((layer) => layer.isPublic).length}`,
  },
  {
    label: "الطبقات الداخلية",
    value: `${demoLayerDetails.filter((layer) => !layer.isPublic).length}`,
  },
  {
    label: "إجمالي السجلات",
    value: `${demoLayerDetails.reduce((sum, layer) => sum + layer.recordsCount, 0)}`,
  },
];

export function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">لوحة الإدارة</h1>
          <p className="mt-2 text-slate-300">
            متابعة الطبقات، الإحصاءات السريعة، والدخول إلى مسار رفع طبقة جديدة.
          </p>
        </div>
        <Link
          className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
          to="/admin/layers/new"
        >
          إضافة طبقة جديدة
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-[1.75rem] border border-white/12 bg-white/8 p-5 backdrop-blur-xl dark:bg-slate-950/30"
          >
            <div className="text-sm text-slate-300">{stat.label}</div>
            <div className="mt-3 text-3xl font-bold text-white">
              {stat.value}
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl dark:bg-slate-950/30">
        <h2 className="text-xl font-semibold text-white">آخر الطبقات</h2>
        <div className="mt-4 space-y-3">
          {demoLayerDetails.map((layer) => (
            <article
              key={layer.slug}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3"
            >
              <div>
                <div className="font-medium text-white">{layer.name}</div>
                <div className="text-sm text-slate-400">
                  {layer.category} • {layer.source}
                </div>
              </div>
              <div className="text-sm text-slate-300">
                {new Date(layer.updatedAt).toLocaleDateString("ar")}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
