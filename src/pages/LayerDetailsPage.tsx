import { Link, useParams } from "react-router-dom";
import { layerRepository } from "@/services/layers";

export function LayerDetailsPage() {
  const { slug = "" } = useParams();
  const layer = layerRepository.getLayerBySlug(slug);

  if (!layer) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-white/8 p-8 text-slate-200 backdrop-blur-xl dark:bg-slate-950/30">
        الطبقة غير موجودة.
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/12 bg-white/8 p-7 backdrop-blur-xl dark:bg-slate-950/30">
          <h1 className="text-3xl font-bold text-white">{layer.name}</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            {layer.description}
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/12 bg-white/8 p-7 backdrop-blur-xl dark:bg-slate-950/30">
          <h2 className="text-xl font-semibold text-white">ملخص البيانات</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-400">المصدر</dt>
              <dd className="mt-1 text-white">{layer.source}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">CRS</dt>
              <dd className="mt-1 text-white">{layer.crs}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">عدد السجلات</dt>
              <dd className="mt-1 text-white">{layer.recordsCount}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">حجم الملف</dt>
              <dd className="mt-1 text-white">
                {(layer.fileSize / 1024).toFixed(0)} KB
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">آخر تحديث</dt>
              <dd className="mt-1 text-white">
                {new Date(layer.updatedAt).toLocaleDateString("ar")}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">تاريخ الإنشاء</dt>
              <dd className="mt-1 text-white">
                {new Date(layer.createdAt).toLocaleDateString("ar")}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-white/12 bg-slate-950/45 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white">التحميل والمعاينة</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            الصيغ المتاحة: {layer.availableFormats.join("، ")}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {layer.qualitySummary}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {layer.usageRights}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
              to={`/map?layer=${layer.slug}`}
            >
              فتح على الخريطة
            </Link>
            <a
              className="rounded-full border border-white/12 px-4 py-2 text-sm text-white"
              href={layer.previewGeoJsonUrl}
            >
              تحميل GeoJSON
            </a>
            {layer.availableFormats.includes("CSV") ? (
              <a
                className="rounded-full border border-white/12 px-4 py-2 text-sm text-white"
                href={`/data/${layer.slug}.csv`}
              >
                تحميل CSV
              </a>
            ) : null}
          </div>
        </div>
      </aside>
    </section>
  );
}
