import { useState } from "react";
import { env } from "@/lib/env";
import { parseLayerUploadFile, uploadLayer } from "@/services/layers/uploadLayer";
import type { ParsedLayerFile } from "@/services/layers/uploadTypes";
import type { LayerLicense, LayerStatus } from "@/types/layers";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none placeholder:text-slate-400";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "");
}

export function AddLayerForm() {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [license, setLicense] = useState<LayerLicense>("open");
  const [status, setStatus] = useState<LayerStatus>("draft");
  const [isPublic, setIsPublic] = useState(true);
  const [crs, setCrs] = useState("EPSG:4326");
  const [file, setFile] = useState<File | null>(null);
  const [parseReport, setParseReport] = useState<ParsedLayerFile | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function inspectFile(nextFile: File | null) {
    setFile(nextFile);
    setParseReport(null);
    setError("");
    setMessage("");

    if (!nextFile) {
      return;
    }

    try {
      const report = await parseLayerUploadFile(nextFile);
      setParseReport(report);
      setMessage("تم فحص الملف بنجاح ويمكن استخدامه كمعاينة GeoJSON.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "تعذر فحص الملف.",
      );
    }
  }

  return (
    <form
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!file) {
          setError("اختر ملف GeoJSON أو CSV قبل الحفظ.");
          return;
        }

        const slug = slugify(name);
        if (!slug) {
          setError("اسم الطبقة مطلوب لإنشاء slug صالح.");
          return;
        }

        setIsSubmitting(true);
        try {
          const localReport = parseReport ?? (await parseLayerUploadFile(file));

          if (env.isDemoMode) {
            setParseReport(localReport);
            setMessage(
              "تم فحص الطبقة محليًا. لضبط الحفظ الحقيقي أضف مفاتيح Supabase في ملف البيئة.",
            );
            return;
          }

          await uploadLayer({
            name,
            slug,
            description,
            categoryId: categoryId || null,
            source,
            license,
            crs,
            status,
            isPublic,
            qualitySummary: localReport.qualitySummary,
            file,
          });
          setMessage("تم حفظ الطبقة وتسجيل العملية بنجاح.");
        } catch (caughtError) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "تعذر حفظ الطبقة.",
          );
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <section className="space-y-4 rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl dark:bg-slate-950/30">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">اسم الطبقة</span>
            <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">التصنيف</span>
            <input className={inputClass} placeholder="مثال: حدود إدارية" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-slate-300">الوصف</span>
            <textarea className={`${inputClass} min-h-28`} value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">مصدر البيانات</span>
            <input className={inputClass} value={source} onChange={(event) => setSource(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">CRS</span>
            <input className={inputClass} value={crs} onChange={(event) => setCrs(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">الترخيص</span>
            <select className={inputClass} value={license} onChange={(event) => setLicense(event.target.value as LayerLicense)}>
              <option value="open">مفتوحة</option>
              <option value="internal">داخلية</option>
              <option value="private">خاصة</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">الحالة</span>
            <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value as LayerStatus)}>
              <option value="draft">مسودة</option>
              <option value="published">منشورة</option>
              <option value="archived">مؤرشفة</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-200">
            <input checked={isPublic} type="checkbox" onChange={(event) => setIsPublic(event.target.checked)} />
            متاحة للعموم
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">رفع ملف</span>
            <input
              accept=".geojson,.csv,application/geo+json,text/csv"
              className={inputClass}
              type="file"
              onChange={(event) => void inspectFile(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-[2rem] border border-white/12 bg-slate-950/45 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white">فحص الجودة</h2>
          {parseReport ? (
            <dl className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between gap-4">
                <dt>عدد السجلات</dt>
                <dd>{parseReport.recordsCount}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>نوع الهندسة</dt>
                <dd>{parseReport.geometryType}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>CRS</dt>
                <dd>{String(parseReport.qualitySummary.crs ?? crs)}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-400">
              اختر ملف GeoJSON أو CSV يحتوي على Lat/Lng لعرض تقرير الجودة.
            </p>
          )}
        </section>

        {message ? <p className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100">{message}</p> : null}
        {error ? <p className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-100">{error}</p> : null}

        <button
          className="w-full rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "جاري الحفظ..." : "حفظ الطبقة"}
        </button>
      </aside>
    </form>
  );
}
