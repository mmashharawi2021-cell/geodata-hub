export type LayerGeometryType = "point" | "line" | "polygon" | "raster" | "tabular";
export type LayerLicense = "open" | "internal" | "private";
export type LayerStatus = "draft" | "published" | "archived";

export interface LayerListItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  source: string;
  geometryType: LayerGeometryType;
  license: LayerLicense;
  isPublic: boolean;
  updatedAt: string;
  downloadsCount: number;
}

export interface LayerDetails extends LayerListItem {
  description: string;
  crs: string;
  createdAt: string;
  fileSize: number;
  recordsCount: number;
  previewGeoJsonUrl: string;
  availableFormats: string[];
  qualitySummary: string;
  usageRights: string;
  notes?: string;
}
