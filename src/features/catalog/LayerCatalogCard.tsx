import { Link } from "react-router-dom";
import type { LayerListItem } from "@/types/layers";

const geometryLabels = {
  point: "نقاط",
  line: "خطوط",
  polygon: "مضلعات",
  raster: "Raster",
  tabular: "جدولي",
} as const;

const licenseLabels = {
  open: "مفتوحة",
  internal: "داخلية",
  private: "خاصة",
} as const;

export function LayerCatalogCard({ layer }: { layer: LayerListItem }) {
  return (
    <article className="rounded-[1.9rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl dark:bg-slate-950/32">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">{layer.name}</h3>
          <p className="mt-2 text-sm text-slate-300">{layer.category}</p>
        </div>
        <span className="rounded-full bg-cyan-300/12 px-3 py-1 text-xs text-cyan-100">
          {geometryLabels[layer.geometryType]}
        </span>
      </div>
      <dl className="mt-5 grid gap-3 text-sm text-slate-300">
        <div className="flex items-center justify-between gap-4">
          <dt>المصدر</dt>
          <dd>{layer.source}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>الترخيص</dt>
          <dd>{licenseLabels[layer.license]}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>آخر تحديث</dt>
          <dd>{new Date(layer.updatedAt).toLocaleDateString("ar")}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
          to={`/layers/${layer.slug}`}
        >
          تفاصيل
        </Link>
        <Link
          className="rounded-full border border-white/12 px-4 py-2 text-sm text-white"
          to={`/map?layer=${layer.slug}`}
        >
          معاينة
        </Link>
      </div>
    </article>
  );
}
