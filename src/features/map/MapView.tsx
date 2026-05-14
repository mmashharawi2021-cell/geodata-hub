import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { LayerListItem } from "@/types/layers";
import { AlertCircle } from "lucide-react";

const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster" as const,
      source: "osm",
    },
  ],
};

export interface MapViewHandle {
  flyTo: (options: { center: [number, number]; zoom?: number }) => void;
}

interface MapViewProps {
  layers: LayerListItem[];
  activeLayers: Set<string>;
  onReady: (handle: MapViewHandle) => void;
}

const MapViewComponent = forwardRef<MapViewHandle, MapViewProps>(
  ({ layers, activeLayers, onReady }, _ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [tileError, setTileError] = useState(false);

    const handleMapError = useCallback(() => {
      setTileError(true);
    }, []);

    useImperativeHandle(_ref, () => ({
      flyTo: ({ center, zoom }) => {
        mapRef.current?.flyTo({ center, zoom });
      },
    }));

    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: OSM_STYLE,
        center: [17.5, 26.5],
        zoom: 5.5,
        attributionControl: false,
      });

      map.addControl(new maplibregl.AttributionControl(), "bottom-left");
      map.addControl(
        new maplibregl.NavigationControl({ visualizePitch: true }),
        "bottom-left",
      );

      map.on("load", () => {
        mapRef.current = map;
        onReady({
          flyTo: ({ center, zoom }) => map.flyTo({ center, zoom }),
        });
      });

      map.on("error", (e) => {
        if (e?.error?.status === 404 || e?.error?.status === 403) {
          handleMapError();
        }
      });

      return () => {
        map.remove();
        mapRef.current = null;
      };
    }, [onReady, handleMapError]);

    useEffect(() => {
      const map = mapRef.current;
      if (!map || !map.isStyleLoaded()) return;

      const currentIds = new Set(
        map.getStyle().layers?.map((l) => l.id) ?? [],
      );

      layers.forEach((layer) => {
        const sourceId = `source-${layer.id}`;
        const layerId = `layer-${layer.id}`;

        if (!map.getSource(sourceId) && layer.sourceUrl) {
          map.addSource(sourceId, {
            type: "geojson",
            data: layer.sourceUrl,
          });
        }

        const isActive = activeLayers.has(layer.id);

        if (isActive && !currentIds.has(layerId) && map.getSource(sourceId)) {
          map.addLayer({
            id: layerId,
            source: sourceId,
            type: "fill",
            paint: {
              "fill-color": "#22d3ee",
              "fill-opacity": 0.15,
            },
          });
        }

        if (!isActive && currentIds.has(layerId)) {
          map.removeLayer(layerId);
        }
      });

      const validLayerIds = new Set(
        layers
          .filter((l) => activeLayers.has(l.id))
          .map((l) => `layer-${l.id}`),
      );

      map.getStyle().layers?.forEach((l) => {
        if (l.id.startsWith("layer-") && !validLayerIds.has(l.id)) {
          try { map.removeLayer(l.id); } catch { /* already removed */ }
        }
      });

      const activeSourceIds = new Set(
        layers.map((l) => `source-${l.id}`),
      );

      const sources = map.getStyle().sources;
      if (sources) {
        Object.keys(sources).forEach((srcId) => {
          if (srcId.startsWith("source-") && !activeSourceIds.has(srcId)) {
            try { map.removeSource(srcId); } catch { /* already removed */ }
          }
        });
      }
    }, [layers, activeLayers]);

    return (
      <div className="w-full h-full absolute inset-0 relative">
        <div
          ref={containerRef}
          className="w-full h-full absolute inset-0"
          style={{ direction: "ltr" }}
        />
        {tileError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[var(--bg)] gap-3 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-amber-400" />
            <p className="text-sm font-bold text-[var(--foreground)]">
              تعذر تحميل بلاطات الخريطة
            </p>
            <p className="text-xs text-[var(--muted)] max-w-xs">
              يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقاً.
            </p>
            <button
              onClick={() => { setTileError(false); mapRef.current?.resize(); }}
              className="btn-ghost btn-sm"
            >
              إعادة المحاولة
            </button>
          </div>
        )}
      </div>
    );
  },
);

MapViewComponent.displayName = "MapView";

export const MapView = MapViewComponent;
