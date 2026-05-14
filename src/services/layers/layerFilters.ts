import type { LayerListItem } from "@/types/layers";

export interface LayerFilterState {
  query: string;
  category: string;
  geometryType: string;
  license: string;
  sort: "newest" | "downloads" | "name";
}

export function applyLayerFilters(
  layers: LayerListItem[],
  filters: LayerFilterState,
) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  const filtered = layers.filter((layer) => {
    const matchesQuery =
      normalizedQuery === "" ||
      [layer.name, layer.category, layer.source].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    const matchesCategory =
      filters.category === "all" || layer.category === filters.category;
    const matchesGeometry =
      filters.geometryType === "all" ||
      layer.geometryType === filters.geometryType;
    const matchesLicense =
      filters.license === "all" || layer.license === filters.license;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesGeometry &&
      matchesLicense
    );
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "downloads") {
      return b.downloadsCount - a.downloadsCount;
    }

    if (filters.sort === "name") {
      return a.name.localeCompare(b.name, "ar");
    }

    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });
}
