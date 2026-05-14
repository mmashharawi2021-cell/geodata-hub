import { MapPin, Route, Square, Layers, Grid3x3 } from "lucide-react";
import type { LayerGeometryType } from "@/types/layers";

const ICON_MAP: Record<LayerGeometryType, typeof MapPin> = {
  point: MapPin,
  line: Route,
  polygon: Square,
  raster: Layers,
  tabular: Grid3x3,
};

const FORMAT_MAP: Record<LayerGeometryType, string> = {
  point: "نقطة",
  line: "خط",
  polygon: "مضلع",
  raster: "مساحي",
  tabular: "جدولي",
};

export function getLayerIcon(geometryType: LayerGeometryType) {
  return ICON_MAP[geometryType] ?? MapPin;
}

export function formatLayerType(geometryType: LayerGeometryType): string {
  return FORMAT_MAP[geometryType] ?? geometryType;
}
