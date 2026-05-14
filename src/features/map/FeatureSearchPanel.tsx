export interface MapSearchResult {
  id: string;
  layerName: string;
  title: string;
  properties?: Record<string, unknown>;
}

export function FeatureSearchPanel({
  query,
  results,
  onQueryChange,
  onSelectResult,
}: {
  query: string;
  results: MapSearchResult[];
  onQueryChange: (value: string) => void;
  onSelectResult: (result: MapSearchResult) => void;
}) {
  return (
    <section className="surface-strong rounded-lg p-4">
      <h2 className="text-base font-bold text-slate-950">بحث داخل الخريطة</h2>
      <input
        className="mt-3 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]"
        placeholder="ابحث باسم معلم أو قيمة حقل"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <div className="mt-4 space-y-2">
        {results.length === 0 && query ? (
          <p className="text-sm text-slate-500">لا توجد نتائج مطابقة.</p>
        ) : null}
        {results.slice(0, 6).map((result) => (
          <button
            key={result.id}
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-right text-sm text-slate-800 transition hover:bg-slate-100"
            type="button"
            onClick={() => onSelectResult(result)}
          >
            <div className="font-medium">{result.title}</div>
            <div className="mt-1 text-xs text-slate-500">{result.layerName}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
