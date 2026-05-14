import { Link } from "react-router-dom";
import { Download, MapPinned, ArrowLeft, ExternalLink } from "lucide-react";
import type { LayerListItem } from "@/types/layers";
import { getLayerIcon, formatLayerType } from "@/utils/layer-utils";

interface LayerCatalogCardProps {
  layer: LayerListItem;
}

export function LayerCatalogCard({ layer }: LayerCatalogCardProps) {
  const Icon = getLayerIcon(layer.geometryType);

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)] flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[#22d3ee]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-base font-bold leading-tight">{layer.name}</h3>
            {layer.category && (
              <span className="badge badge-primary">{layer.category}</span>
            )}
            <span className="badge">{formatLayerType(layer.geometryType)}</span>
          </div>

          <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
            {layer.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-[var(--muted)] mb-4">
        <span className="flex items-center gap-1.5">
          <MapPinned className="w-3.5 h-3.5" />
          {layer.coverage || "غير محدد"}
        </span>
        {layer.source && (
          <span className="flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
            {layer.source}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 pt-3 border-t border-[var(--border)]">
        <Link
          to={`/layers/${layer.slug || layer.id}`}
          className="btn-primary btn-sm flex-1"
        >
          <ArrowLeft className="w-4 h-4" />
          تفاصيل
        </Link>
        {layer.downloadUrl && (
          <a
            href={layer.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost btn-sm"
          >
            <Download className="w-4 h-4" />
            تحميل
          </a>
        )}
      </div>
    </div>
  );
}
