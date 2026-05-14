import { demoLayerDetails } from "@/data/demo/layerDetails";
import type { LayerListItem } from "@/types/layers";

export const demoLayers: LayerListItem[] = demoLayerDetails.map((layer) => ({
  category: layer.category,
  coverage: layer.coverage,
  dataAccessType: layer.dataAccessType,
  description: layer.description,
  downloadUrl: layer.downloadUrl,
  downloadsCount: layer.downloadsCount,
  geometryType: layer.geometryType,
  id: layer.id,
  isDownloadable: layer.isDownloadable,
  isPreviewable: layer.isPreviewable,
  isPublic: layer.isPublic,
  license: layer.license,
  licenseUrl: layer.licenseUrl,
  name: layer.name,
  recordsCountLabel: layer.recordsCountLabel,
  slug: layer.slug,
  source: layer.source,
  sourceUrl: layer.sourceUrl,
  tags: layer.tags,
  updatedAt: layer.updatedAt,
  updateFrequency: layer.updateFrequency,
}));
