import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  Database,
  Download,
  ExternalLink,
  FileText,
  Layers3,
  Lock,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import { layerRepository } from "@/services/layers";

const geometryLabels: Record<string, string> = {
  point: "نقاط",
  line: "خطوط",
  polygon: "مضلعات",
  raster: "Raster",
  tabular: "جدول",
};

const licenseLabels: Record<string, string> = {
  open: "مفتوحة",
  internal: "داخلية",
  private: "خاصة",
};

export function LayerDetailsPage() {
  const { slug = "" } = useParams();
  const layer = layerRepository.getLayerBySlug(slug);

  if (!layer) {
    return (
      <section className="glass-panel flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl p-8 text-center">
        <Layers3 className="size-14 text-[var(--muted)]" />
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">الطبقة غير موجودة</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            لا توجد طبقة بهذا المعرف. قد يكون الرابط غير صحيح أو تمت أرشفة الطبقة.
          </p>
        </div>
        <Link className="btn-primary mt-2" to="/catalog">العودة إلى الكتالوج</Link>
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
        <div className="hero-panel overflow-hidden rounded-2xl p-7 sm:p-8 relative">
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent)] opacity-[0.04] blur-3xl" />
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="badge badge-accent">{layer.category}</span>
            <span className="badge badge-primary">
              {geometryLabels[layer.geometryType] ?? layer.geometryType}
            </span>
            <span className="badge badge-primary">
              {licenseLabels[layer.license] ?? layer.license}
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-bold text-white md:text-4xl">
            {layer.name}
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-[#c8d8e8]">
            {layer.description}
          </p>
        </div>

        <div className="glass-panel-strong rounded-2xl p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              ملخص البيانات
            </h2>
            <span className="badge badge-accent text-[10px]">
              {layer.isPublic ? "متاحة للتحميل العام" : "تحميل مقيد"}
            </span>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {metadataRows.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="glass-card rounded-xl p-4"
                >
                  <dt className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <Icon className="size-4 text-[var(--accent)]" />
                    {item.label}
                  </dt>
                  <dd className="mt-2 font-semibold text-[var(--foreground)]">
                    {item.value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="glass-panel-strong rounded-2xl p-7">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            الجودة والملاحظات
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                <ShieldCheck className="size-4" />
                تقرير الجودة
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {layer.qualitySummary}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
                <Lock className="size-4 text-[var(--accent)]" />
                حقوق الاستخدام
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {layer.usageRights}
              </p>
            </div>
          </div>
          {layer.notes ? (
            <p className="mt-4 rounded-xl border border-[var(--copper)]/20 bg-[var(--copper)]/[0.06] p-4 text-sm leading-7 text-[var(--copper)]">
              {layer.notes}
            </p>
          ) : null}
        </div>
      </div>

      <aside className="space-y-6">
        <div className="glass-panel-strong sticky top-24 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            التحميل والمعاينة
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            الصيغ المتاحة: {layer.availableFormats.join("، ")}
          </p>
          <div className="mt-5 space-y-3">
            {layer.isPreviewable !== false && layer.previewGeoJsonUrl ? (
              <>
                <Link
                  className="btn-primary w-full"
                  to={`/map?layer=${layer.slug}`}
                >
                  <MapPinned className="size-4" />
                  فتح على الخريطة
                </Link>
                <a
                  className="btn-ghost w-full"
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
                className="btn-ghost w-full"
                href={`/data/${layer.slug}.csv`}
              >
                <FileText className="size-4" />
                تحميل CSV
              </a>
            ) : null}
            {layer.downloadUrl ? (
              <a
                className="btn-accent w-full"
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
                className="btn-ghost w-full"
                href={layer.licenseUrl}
                rel="noreferrer"
                target="_blank"
              >
                <ShieldCheck className="size-4" />
                مراجعة الترخيص
              </a>
            ) : null}
          </div>
          <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs leading-6 text-[var(--muted)]">
            يتم إخفاء أو تقييد الملفات الخاصة عند ربط Supabase/RLS حسب دور المستخدم.
          </div>
        </div>
      </aside>
    </section>
  );
}
