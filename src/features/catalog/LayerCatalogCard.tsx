import { Link } from "react-router-dom";
import { ArrowLeft, Download, Eye, Lock, MapPinned } from "lucide-react";
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
    <article className="surface-strong rounded-lg p-4 transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-950">{layer.name}</h3>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
              {geometryLabels[layer.geometryType]}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-500">{layer.category}</p>
        </div>
        {layer.isPublic ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
            <Eye size={13} />
            عام
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
            <Lock size={13} />
            داخلي
          </span>
        )}
      </div>

      <dl className="mt-4 grid gap-2 border-y border-slate-100 py-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">المصدر</dt>
          <dd className="font-semibold text-slate-800">{layer.source}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">الترخيص</dt>
          <dd className="font-semibold text-slate-800">{licenseLabels[layer.license]}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">آخر تحديث</dt>
          <dd className="font-semibold text-slate-800">
            {new Date(layer.updatedAt).toLocaleDateString("ar")}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-bold text-white"
          to={`/layers/${layer.slug}`}
        >
          تفاصيل
          <ArrowLeft size={15} />
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"
          to={`/map?layer=${layer.slug}`}
        >
          <MapPinned size={15} />
          معاينة
        </Link>
        {layer.isPublic ? (
          <Link
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"
            to={`/layers/${layer.slug}`}
          >
            <Download size={15} />
            تحميل
          </Link>
        ) : null}
      </div>
    </article>
  );
}
