import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  Database,
  Download,
  ExternalLink,
  FileText,
  Lock,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import { layerRepository } from "@/services/layers";

const geometryLabels = {
  point: "نقاط",
  line: "خطوط",
  polygon: "مضلعات",
  raster: "Raster",
  tabular: "جدول",
};

const licenseLabels = {
  open: "مفتوحة",
  internal: "داخلية",
  private: "خاصة",
};

export function LayerDetailsPage() {
  const { slug = "" } = useParams();
  const layer = layerRepository.getLayerBySlug(slug);

  if (!layer) {
    return (
      <section className="surface-strong rounded-lg p-8 text-slate-700 dark:text-slate-200">
        الطبقة غير موجودة.
      </section>
    );
  }

  const metadataRows = [
    { label: "المصدر", value: layer.source, icon: Database },
    { label: "نظام الإحداثيات", value: layer.crs, icon: MapPinned },
    {
      label: "عدد السجلات",
      value: layer.recordsCountLabel ?? layer.recordsCount.toLocaleString("ar"),
      icon: FileText,
    },
    {
      label: "حجم الملف",
      value: layer.fileSizeLabel ?? `${(layer.fileSize / 1024).toFixed(0)} KB`,
      icon: Download,
    },
    ...(layer.coverage
      ? [{ label: "التغطية", value: layer.coverage, icon: MapPinned }]
      : []),
    ...(layer.updateFrequency
      ? [
          {
            label: "وتيرة التحديث",
            value: layer.updateFrequency,
            icon: CalendarDays,
          },
        ]
      : []),
    {
      label: "آخر تحديث",
      value: new Date(layer.updatedAt).toLocaleDateString("ar"),
      icon: CalendarDays,
    },
    {
      label: "تاريخ الإنشاء",
      value: new Date(layer.createdAt).toLocaleDateString("ar"),
      icon: CalendarDays,
    },
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <div className="dark-panel overflow-hidden rounded-lg p-7">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-md bg-white/12 px-3 py-1 text-cyan-50">
              {layer.category}
            </span>
            <span className="rounded-md bg-white/12 px-3 py-1 text-cyan-50">
              {geometryLabels[layer.geometryType]}
            </span>
            <span className="rounded-md bg-white/12 px-3 py-1 text-cyan-50">
              {licenseLabels[layer.license]}
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-bold text-white md:text-4xl">
            {layer.name}
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-200">
            {layer.description}
          </p>
        </div>

        <div className="surface-strong rounded-lg p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              ملخص البيانات
            </h2>
            <span className="rounded-md bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
              {layer.isPublic ? "متاحة للتحميل العام" : "تحميل مقيد"}
            </span>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {metadataRows.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Icon className="size-4 text-teal-600 dark:text-teal-300" />
                    {item.label}
                  </dt>
                  <dd className="mt-2 font-semibold text-slate-950 dark:text-white">
                    {item.value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="surface-strong rounded-lg p-7">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            الجودة والملاحظات
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-200">
                <ShieldCheck className="size-4" />
                تقرير الجودة
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {layer.qualitySummary}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <Lock className="size-4 text-teal-600 dark:text-teal-300" />
                حقوق الاستخدام
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {layer.usageRights}
              </p>
            </div>
          </div>
          {layer.notes ? (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
              {layer.notes}
            </p>
          ) : null}
        </div>
      </div>

      <aside className="space-y-6">
        <div className="surface-strong sticky top-24 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            التحميل والمعاينة
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            الصيغ المتاحة: {layer.availableFormats.join("، ")}
          </p>
          <div className="mt-5 space-y-3">
            {layer.isPreviewable !== false && layer.previewGeoJsonUrl ? (
              <>
                <Link
                  className="flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950"
                  to={`/map?layer=${layer.slug}`}
                >
                  <MapPinned className="size-4" />
                  فتح على الخريطة
                </Link>
                <a
                  className="flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  href={layer.previewGeoJsonUrl}
                >
                  <Download className="size-4" />
                  تحميل GeoJSON
                </a>
              </>
            ) : null}
            {layer.dataAccessType === "local" &&
            layer.availableFormats.includes("CSV") ? (
              <a
                className="flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-white/5 dark:text-white"
                href={`/data/${layer.slug}.csv`}
              >
                <FileText className="size-4" />
                تحميل CSV
              </a>
            ) : null}
            {layer.downloadUrl ? (
              <a
                className="flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#007970]"
                href={layer.downloadUrl}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink className="size-4" />
                فتح المصدر الرسمي
              </a>
            ) : null}
            {layer.licenseUrl ? (
              <a
                className="flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-white/5 dark:text-white"
                href={layer.licenseUrl}
                rel="noreferrer"
                target="_blank"
              >
                <ShieldCheck className="size-4" />
                مراجعة الترخيص
              </a>
            ) : null}
          </div>
          <div className="mt-5 rounded-lg bg-slate-50 p-4 text-xs leading-6 text-slate-500 dark:bg-white/5 dark:text-slate-400">
            يتم إخفاء أو تقييد الملفات الخاصة عند ربط Supabase/RLS حسب دور
            المستخدم.
          </div>
        </div>
      </aside>
    </section>
  );
}
