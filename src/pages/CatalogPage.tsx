import { useMemo, useState, useEffect } from "react";
import { CatalogFilters } from "@/features/catalog/CatalogFilters";
import { LayerCatalogCard } from "@/features/catalog/LayerCatalogCard";
import { layerRepository } from "@/services/layers";
import { applyLayerFilters, type LayerFilterState } from "@/services/layers/layerFilters";
import { Database, AlertCircle, RefreshCw } from "lucide-react";
import type { LayerListItem } from "@/types/layers";

export function CatalogPage() {
  const [layers, setLayers] = useState<LayerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<LayerFilterState>({
    query: "",
    category: "all",
    geometryType: "all",
    license: "all",
    sort: "newest",
  });

  useEffect(() => {
    try {
      const data = layerRepository.listPublicLayers();
      setLayers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, []);

  const categories = useMemo(
    () => [...new Set(layers.map((l) => l.category).filter(Boolean))],
    [layers],
  );

  const geometryTypes = useMemo(
    () => [...new Set(layers.map((l) => l.geometryType).filter(Boolean))],
    [layers],
  );

  const filtered = useMemo(
    () => applyLayerFilters(layers, filters),
    [layers, filters],
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-2 border-[var(--border)] border-t-[#22d3ee] rounded-full animate-spin" />
            <p className="text-sm text-[var(--muted)]">جار تحميل الكتالوج...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertCircle className="w-10 h-10 text-rose-400" />
            <p className="text-sm text-[var(--muted)]">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-ghost btn-sm">
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">الكتالوج</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              {filtered.length} {filtered.length === 1 ? "طبقة" : "طبقات"}{" "}
              {filters.query || filters.category !== "all" || filters.geometryType !== "all" ? "مطابقة" : "متاحة"}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)] flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-[#22d3ee]" />
          </div>
        </div>

        <CatalogFilters
          search={filters.query}
          onSearchChange={(v) => setFilters((prev) => ({ ...prev, query: v }))}
          category={filters.category === "all" ? "" : filters.category}
          onCategoryChange={(v) => setFilters((prev) => ({ ...prev, category: v || "all" }))}
          type={filters.geometryType === "all" ? "" : filters.geometryType}
          onTypeChange={(v) => setFilters((prev) => ({ ...prev, geometryType: v || "all" }))}
          categories={categories}
          types={geometryTypes}
        />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Database className="w-10 h-10 text-[var(--muted)]" />
            <p className="text-sm text-[var(--muted)]">لا توجد طبقات مطابقة</p>
            <button
              onClick={() => setFilters({ query: "", category: "all", geometryType: "all", license: "all", sort: "newest" })}
              className="btn-ghost btn-sm"
            >
              إعادة تعيين الفلتر
            </button>
          </div>
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((layer) => (
              <div key={layer.id} className="animate-fade-up">
                <LayerCatalogCard layer={layer} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
