import { Search, MapPin } from "lucide-react";

export interface MapSearchResult {
  id: string;
  layerName: string;
  title: string;
  properties?: Record<string, unknown>;
}

interface FeatureSearchPanelProps {
  query: string;
  results: MapSearchResult[];
  onQueryChange: (value: string) => void;
  onSelectResult: (result: MapSearchResult) => void;
}

export function FeatureSearchPanel({
  query,
  results,
  onQueryChange,
  onSelectResult,
}: FeatureSearchPanelProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
        <input
          type="text"
          placeholder="ابحث عن معلم..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="input-glass pr-9 text-sm"
        />
      </div>

      {results.length === 0 && query ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <MapPin className="w-6 h-6 text-[var(--muted)]" />
          <p className="text-xs text-[var(--muted)]">لا توجد نتائج</p>
        </div>
      ) : null}

      <div className="space-y-1">
        {results.slice(0, 6).map((result) => (
          <button
            key={result.id}
            onClick={() => onSelectResult(result)}
            className="w-full glass-card rounded-xl p-3 text-right hover:border-[rgba(34,211,238,0.2)] transition-all duration-200"
          >
            <div className="text-xs font-bold">{result.title}</div>
            <div className="text-[0.6rem] text-[var(--muted)] mt-0.5">{result.layerName}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
