import { Eye, EyeOff } from "lucide-react";
import type { LayerListItem } from "@/types/layers";
import { getLayerIcon, formatLayerType } from "@/utils/layer-utils";

interface LayerControlPanelProps {
  layers: LayerListItem[];
  activeLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
}

export function LayerControlPanel({
  layers,
  activeLayers,
  onLayerToggle,
}: LayerControlPanelProps) {
  if (layers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
        <EyeOff className="w-6 h-6 text-[var(--muted)]" />
        <p className="text-xs text-[var(--muted)]">لا توجد طبقات متاحة</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {layers.map((layer) => {
        const Icon = getLayerIcon(layer.geometryType);
        const isActive = activeLayers.has(layer.id);

        return (
          <button
            key={layer.id}
            onClick={() => onLayerToggle(layer.id)}
            className={`w-full glass-card rounded-xl p-3 text-right transition-all duration-200 ${
              isActive
                ? "border-[rgba(34,211,238,0.3)] bg-[rgba(34,211,238,0.04)]"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? "bg-gradient-to-br from-[rgba(34,211,238,0.2)] to-[rgba(34,211,238,0.08)]"
                    : "bg-[rgba(255,255,255,0.04)]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#22d3ee]" : "text-[var(--muted)]"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0 text-right">
                <p className={`text-xs font-bold truncate ${
                  isActive ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                }`}>
                  {layer.name}
                </p>
                <span className="text-[0.6rem] text-[var(--muted)]">
                  {formatLayerType(layer.geometryType)}
                </span>
              </div>

              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[rgba(34,211,238,0.1)] text-[#22d3ee]"
                    : "text-[var(--muted)]"
                }`}
              >
                {isActive ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
