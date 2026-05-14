import { describe, expect, it } from "vitest";
import { applyLayerFilters } from "@/services/layers/layerFilters";
import type { LayerListItem } from "@/types/layers";

const layers: LayerListItem[] = [
  {
    id: "1",
    name: "حدود الأحياء",
    slug: "districts",
    category: "حدود إدارية",
    source: "البلدية",
    geometryType: "polygon",
    license: "open",
    isPublic: true,
    updatedAt: "2026-05-10T00:00:00Z",
    downloadsCount: 3,
  },
  {
    id: "2",
    name: "المدارس",
    slug: "schools",
    category: "مدارس",
    source: "التربية",
    geometryType: "point",
    license: "internal",
    isPublic: false,
    updatedAt: "2026-05-12T00:00:00Z",
    downloadsCount: 8,
  },
];

describe("applyLayerFilters", () => {
  it("filters by search text and sorts by newest", () => {
    const result = applyLayerFilters(layers, {
      query: "مدارس",
      category: "all",
      geometryType: "all",
      license: "all",
      sort: "newest",
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("schools");
  });
});
