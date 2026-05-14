import type { LayerDetails, LayerListItem } from "@/types/layers";

export interface LayerRepository {
  listPublicLayers(): LayerListItem[];
  getLayerBySlug(slug: string): LayerDetails | null;
}
