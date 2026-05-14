import type { FeatureCollection } from "geojson";
import Papa from "papaparse";
import type { ParsedLayerFile } from "@/services/layers/uploadTypes";

const latColumns = ["lat", "latitude", "y", "خط_العرض"];
const lngColumns = ["lng", "lon", "longitude", "x", "خط_الطول"];

function findCoordinateColumn(columns: string[], candidates: string[]) {
  return columns.find((column) => candidates.includes(column.trim().toLowerCase()));
}

export async function parseCsvLayerFile(file: File): Promise<ParsedLayerFile> {
  if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
    throw new Error("الملف يجب أن يكون بصيغة CSV.");
  }

  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error("تعذر قراءة CSV. تحقق من الفواصل والعناوين.");
  }

  const columns = parsed.meta.fields ?? [];
  const latColumn = findCoordinateColumn(columns, latColumns);
  const lngColumn = findCoordinateColumn(columns, lngColumns);

  if (!latColumn || !lngColumn) {
    throw new Error("ملف CSV يحتاج أعمدة إحداثيات Lat/Lng واضحة.");
  }

  const features = parsed.data
    .map((row, index) => {
      const lat = Number(row[latColumn]);
      const lng = Number(row[lngColumn]);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
      }

      return {
        type: "Feature" as const,
        id: `${index + 1}`,
        geometry: {
          type: "Point" as const,
          coordinates: [lng, lat],
        },
        properties: row,
      };
    })
    .filter((feature) => feature !== null);

  if (features.length === 0) {
    throw new Error("لا توجد صفوف بإحداثيات صالحة داخل CSV.");
  }

  const preview: FeatureCollection = {
    type: "FeatureCollection",
    features,
  };

  return {
    recordsCount: features.length,
    geometryType: "point",
    preview,
    qualitySummary: {
      hasGeometry: true,
      generatedFromCsv: true,
      skippedRows: parsed.data.length - features.length,
      crs: "EPSG:4326",
    },
  };
}
