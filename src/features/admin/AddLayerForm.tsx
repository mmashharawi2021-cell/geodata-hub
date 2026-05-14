import { useState } from "react";
import { AlertCircle, FileCheck2, Save, UploadCloud } from "lucide-react";
import { env } from "@/lib/env";
import { parseLayerUploadFile, uploadLayer } from "@/services/layers/uploadLayer";
import type { ParsedLayerFile } from "@/services/layers/uploadTypes";
import type { LayerLicense, LayerStatus } from "@/types/layers";

const inputClass =
  "w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-white/10 dark:bg-slate-950/45 dark:text-white";

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
      <section className="surface-strong space-y-5 rounded-lg p-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            بيانات الطبقة
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            أدخل بيانات تعريف واضحة حتى تكون الطبقة قابلة للفهرسة والمراجعة.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">اسم الطبقة</span>
            <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">التصنيف</span>
            <input className={inputClass} placeholder="مثال: حدود إدارية" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">الوصف</span>
            <textarea className={`${inputClass} min-h-28`} value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">مصدر البيانات</span>
            <input className={inputClass} value={source} onChange={(event) => setSource(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">CRS</span>
            <input className={inputClass} value={crs} onChange={(event) => setCrs(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">الترخيص</span>
            <select className={inputClass} value={license} onChange={(event) => setLicense(event.target.value as LayerLicense)}>
              <option value="open">مفتوحة</option>
              <option value="internal">داخلية</option>
              <option value="private">خاصة</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">الحالة</span>
            <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value as LayerStatus)}>
              <option value="draft">مسودة</option>
              <option value="published">منشورة</option>
              <option value="archived">مؤرشفة</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <input checked={isPublic} type="checkbox" onChange={(event) => setIsPublic(event.target.checked)} />
            متاحة للعموم
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">رفع ملف</span>
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
        <section className="surface-strong rounded-lg p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-teal-50 p-2 text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
              <FileCheck2 className="size-5" />
            </span>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              فحص الجودة
            </h2>
          </div>
          {parseReport ? (
            <dl className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between gap-4 rounded-md bg-slate-50 px-3 py-2 dark:bg-white/5">
                <dt>عدد السجلات</dt>
                <dd className="font-semibold text-slate-950 dark:text-white">
                  {parseReport.recordsCount}
                </dd>
              </div>
              <div className="flex justify-between gap-4 rounded-md bg-slate-50 px-3 py-2 dark:bg-white/5">
                <dt>نوع الهندسة</dt>
                <dd className="font-semibold text-slate-950 dark:text-white">
                  {parseReport.geometryType}
                </dd>
              </div>
              <div className="flex justify-between gap-4 rounded-md bg-slate-50 px-3 py-2 dark:bg-white/5">
                <dt>CRS</dt>
                <dd className="font-semibold text-slate-950 dark:text-white">
                  {String(parseReport.qualitySummary.crs ?? crs)}
                </dd>
              </div>
            </dl>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-7 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              <UploadCloud className="mb-3 size-6 text-teal-600 dark:text-teal-300" />
              اختر ملف GeoJSON أو CSV يحتوي على Lat/Lng لعرض تقرير الجودة.
            </div>
          )}
        </section>

        {message ? (
          <p className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm leading-7 text-teal-800 dark:border-teal-300/20 dark:bg-teal-300/10 dark:text-teal-100">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="flex gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-800 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-100">
            <AlertCircle className="mt-1 size-4 shrink-0" />
            {error}
          </p>
        ) : null}

        <button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-300 dark:text-slate-950"
          disabled={isSubmitting}
          type="submit"
        >
          <Save className="size-4" />
          {isSubmitting ? "جاري الحفظ..." : "حفظ الطبقة"}
        </button>
      </aside>
    </form>
  );
}
