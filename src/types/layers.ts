export type LayerGeometryType = "point" | "line" | "polygon" | "raster" | "tabular";
export type LayerLicense = "open" | "internal" | "private";
export type LayerStatus = "draft" | "published" | "archived";

export interface LayerListItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  source: string;
  geometryType: LayerGeometryType;
  license: LayerLicense;
  isPublic: boolean;
  updatedAt: string;
  downloadsCount: number;
  coverage?: string;
  dataAccessType?: "external" | "local" | "supabase";
  downloadUrl?: string;
  isDownloadable?: boolean;
  isPreviewable?: boolean;
  licenseUrl?: string;
  recordsCountLabel?: string;
  sourceUrl?: string;
  tags?: string[];
  updateFrequency?: string;
}

export interface LayerDetails extends LayerListItem {
  description: string;
  crs: string;
  createdAt: string;
  fileSize: number;
  fileSizeLabel?: string;
  recordsCount: number;
  previewGeoJsonUrl?: string;
  availableFormats: string[];
  qualitySummary: string;
  usageRights: string;
  notes?: string;
}
