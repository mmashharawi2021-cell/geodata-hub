import type { LayerFilterState } from "@/services/layers/layerFilters";

export function CatalogFilters({
  value,
  onChange,
}: {
  value: LayerFilterState;
  onChange: (nextValue: LayerFilterState) => void;
}) {
  return (
    <div className="grid gap-3 rounded-[1.75rem] border border-white/12 bg-white/8 p-4 backdrop-blur-xl md:grid-cols-4 dark:bg-slate-950/30">
      <input
        className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
        placeholder="ابحث بالاسم أو المصدر"
        value={value.query}
        onChange={(event) => onChange({ ...value, query: event.target.value })}
      />
      <select
        className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white outline-none"
        value={value.category}
        onChange={(event) =>
          onChange({ ...value, category: event.target.value })
        }
      >
        <option value="all">كل التصنيفات</option>
        <option value="حدود إدارية">حدود إدارية</option>
        <option value="مدارس">مدارس</option>
        <option value="طرق وشوارع">طرق وشوارع</option>
      </select>
      <select
        className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white outline-none"
        value={value.geometryType}
        onChange={(event) =>
          onChange({ ...value, geometryType: event.target.value })
        }
      >
        <option value="all">كل الأنواع</option>
        <option value="point">نقاط</option>
        <option value="line">خطوط</option>
        <option value="polygon">مضلعات</option>
      </select>
      <select
        className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white outline-none"
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
  );
}
