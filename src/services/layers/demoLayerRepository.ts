import { demoLayerDetails } from "@/data/demo/layerDetails";
import { demoLayers } from "@/data/demo/layers";
import type { LayerRepository } from "@/services/layers/layerRepository";

export const demoLayerRepository: LayerRepository = {
  listPublicLayers() {
    return demoLayers.filter((layer) => layer.isPublic);
  },
  getLayerBySlug(slug) {
    return demoLayerDetails.find((layer) => layer.slug === slug) ?? null;
  },
};
