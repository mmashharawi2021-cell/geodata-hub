import type { FeatureCollection } from "geojson";
import type { LayerGeometryType, LayerLicense, LayerStatus } from "@/types/layers";

export interface ParsedLayerFile {
  recordsCount: number;
  geometryType: LayerGeometryType;
  preview: FeatureCollection;
  qualitySummary: Record<string, unknown>;
}

export interface UploadLayerPayload {
  name: string;
  slug: string;
  description: string;
  categoryId: string | null;
  source: string;
  license: LayerLicense;
  crs: string;
  status: LayerStatus;
  isPublic: boolean;
  qualitySummary: Record<string, unknown>;
  file: File;
}
