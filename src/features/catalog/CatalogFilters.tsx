import { Search, SlidersHorizontal } from "lucide-react";
import type { LayerFilterState } from "@/services/layers/layerFilters";

const inputClass =
  "h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]";

export function CatalogFilters({
  value,
  onChange,
  categories,
}: {
  value: LayerFilterState;
  onChange: (nextValue: LayerFilterState) => void;
  categories: string[];
}) {
  return (
    <div className="surface rounded-lg p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
        <SlidersHorizontal size={16} />
        أدوات البحث والفرز
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(220px,1.4fr)_1fr_1fr_1fr_1fr]">
        <label className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            className={`${inputClass} w-full pr-9`}
            placeholder="ابحث بالاسم أو المصدر"
            value={value.query}
            onChange={(event) => onChange({ ...value, query: event.target.value })}
          />
        </label>
        <select
          className={inputClass}
          value={value.category}
          onChange={(event) =>
            onChange({ ...value, category: event.target.value })
          }
        >
          <option value="all">كل التصنيفات</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className={inputClass}
          value={value.geometryType}
          onChange={(event) =>
            onChange({ ...value, geometryType: event.target.value })
          }
        >
          <option value="all">كل الأنواع</option>
          <option value="point">نقاط</option>
          <option value="line">خطوط</option>
          <option value="polygon">مضلعات</option>
          <option value="raster">Raster</option>
          <option value="tabular">جدولي</option>
        </select>
        <select
          className={inputClass}
          value={value.license}
          onChange={(event) =>
            onChange({ ...value, license: event.target.value })
          }
        >
          <option value="all">كل التراخيص</option>
          <option value="open">مفتوحة</option>
          <option value="internal">داخلية</option>
          <option value="private">خاصة</option>
        </select>
        <select
          className={inputClass}
          value={value.sort}
          onChange={(event) =>
            onChange({
              ...value,
              sort: event.target.value as LayerFilterState["sort"],
            })
          }
        >
          <option value="newest">الأحدث</option>
          <option value="downloads">الأكثر تحميلًا</option>
          <option value="name">الاسم</option>
        </select>
      </div>
    </div>
  );
}
