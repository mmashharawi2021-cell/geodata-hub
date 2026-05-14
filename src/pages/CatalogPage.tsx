import { useMemo, useState } from "react";
import { CatalogFilters } from "@/features/catalog/CatalogFilters";
import { LayerCatalogCard } from "@/features/catalog/LayerCatalogCard";
import { layerRepository } from "@/services/layers";
import {
  applyLayerFilters,
  type LayerFilterState,
} from "@/services/layers/layerFilters";

const initialFilters: LayerFilterState = {
  query: "",
  category: "all",
  geometryType: "all",
  license: "all",
  sort: "newest",
};

export function CatalogPage() {
  const [filters, setFilters] = useState(initialFilters);
  const layers = layerRepository.listPublicLayers();
  const visibleLayers = useMemo(
    () => applyLayerFilters(layers, filters),
    [filters, layers],
  );

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-white">مكتبة البيانات</h1>
        <p className="max-w-3xl text-base leading-7 text-slate-300">
          استعرض الطبقات الجغرافية، صفّها حسب النوع والمصدر، وافتح التفاصيل أو
          المعاينة على الخريطة.
        </p>
      </div>

      <CatalogFilters value={filters} onChange={setFilters} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleLayers.map((layer) => (
          <LayerCatalogCard key={layer.id} layer={layer} />
        ))}
      </div>
    </section>
  );
}
