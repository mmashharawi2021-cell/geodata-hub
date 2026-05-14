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
    <section className="rounded-[1.75rem] border border-white/12 bg-white/8 p-4 backdrop-blur-xl dark:bg-slate-950/30">
      <h2 className="text-lg font-semibold text-white">بحث داخل الخريطة</h2>
      <input
        className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
        placeholder="ابحث باسم معلم أو قيمة حقل"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <div className="mt-4 space-y-2">
        {results.length === 0 && query ? (
          <p className="text-sm text-slate-400">لا توجد نتائج مطابقة.</p>
        ) : null}
        {results.slice(0, 6).map((result) => (
          <button
            key={result.id}
            className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-right text-sm text-slate-100 transition hover:bg-white/12"
            type="button"
            onClick={() => onSelectResult(result)}
          >
            <div className="font-medium">{result.title}</div>
            <div className="mt-1 text-xs text-slate-400">{result.layerName}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
