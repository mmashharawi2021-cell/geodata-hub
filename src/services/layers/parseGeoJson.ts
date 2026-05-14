import type { FeatureCollection, Geometry } from "geojson";
import type { LayerGeometryType } from "@/types/layers";
import type { ParsedLayerFile } from "@/services/layers/uploadTypes";

function normalizeGeometryType(geometryType: string): LayerGeometryType {
  const normalized = geometryType.toLowerCase();

  if (normalized.includes("point")) {
    return "point";
  }

  if (normalized.includes("line")) {
    return "line";
  }

  if (normalized.includes("polygon")) {
    return "polygon";
  }

  return "tabular";
}

export async function parseGeoJsonFile(file: File): Promise<ParsedLayerFile> {
  if (!file.name.toLowerCase().endsWith(".geojson") && file.type !== "application/geo+json") {
    throw new Error("الملف يجب أن يكون بصيغة GeoJSON.");
  }

  const text = await file.text();
  const parsed = JSON.parse(text) as FeatureCollection;

  if (parsed.type !== "FeatureCollection" || !Array.isArray(parsed.features)) {
    throw new Error("ملف GeoJSON غير صالح.");
  }

  const firstGeometry = parsed.features.find((feature) => feature.geometry)
    ?.geometry as Geometry | undefined;

  if (!firstGeometry) {
    throw new Error("الملف لا يحتوي على Geometry صالحة للمعاينة.");
  }

  const emptyGeometryCount = parsed.features.filter((feature) => !feature.geometry).length;

  return {
    recordsCount: parsed.features.length,
    geometryType: normalizeGeometryType(firstGeometry.type),
    preview: parsed,
    qualitySummary: {
      hasGeometry: true,
      emptyGeometryCount,
      crs: "EPSG:4326",
    },
  };
}
