import type { LayerRepository } from "@/services/layers/layerRepository";

export const supabaseLayerRepository: LayerRepository = {
  listPublicLayers() {
    return [];
  },
  getLayerBySlug() {
    return null;
  },
};
