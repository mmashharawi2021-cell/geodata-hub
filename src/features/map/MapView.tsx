import { useEffect, useMemo, useRef } from "react";
import type { FeatureCollection, Geometry } from "geojson";
import maplibregl, { LngLatBounds } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export interface MapLayerPayload {
  slug: string;
  name: string;
  geometryType: "point" | "line" | "polygon";
  opacity: number;
  visible: boolean;
  collection: FeatureCollection;
}

interface SelectedFeaturePayload {
  id: string;
  properties?: Record<string, unknown>;
  geometry?: Geometry | null;
}

function buildMapLayerConfig(
  layer: MapLayerPayload,
  sourceId: string,
  layerId: string,
): Parameters<maplibregl.Map["addLayer"]>[0] {
  if (layer.geometryType === "point") {
    return {
      id: layerId,
      type: "circle",
      source: sourceId,
      layout: { visibility: layer.visible ? "visible" : "none" },
      paint: {
        "circle-color": "#2bb7a9",
        "circle-radius": 6,
        "circle-opacity": layer.opacity,
        "circle-stroke-width": 1.5,
        "circle-stroke-color": "#e8feff",
      },
    } as unknown as Parameters<maplibregl.Map["addLayer"]>[0];
  }

  if (layer.geometryType === "line") {
    return {
      id: layerId,
      type: "line",
      source: sourceId,
      layout: { visibility: layer.visible ? "visible" : "none" },
      paint: {
        "line-color": "#4da3ff",
        "line-width": 3,
        "line-opacity": layer.opacity,
      },
    } as unknown as Parameters<maplibregl.Map["addLayer"]>[0];
  }

  return {
    id: layerId,
    type: "fill",
    source: sourceId,
    layout: { visibility: layer.visible ? "visible" : "none" },
    paint: {
      "fill-color": "#0f4c81",
      "fill-opacity": layer.opacity,
      "fill-outline-color": "#9fdaff",
    },
  } as unknown as Parameters<maplibregl.Map["addLayer"]>[0];
}

function getFeatureCenter(feature: SelectedFeaturePayload) {
  const geometry = feature.geometry;

  if (!geometry) {
    return null;
  }

  if (geometry.type === "Point") {
    return geometry.coordinates as [number, number];
  }

  if (!("coordinates" in geometry)) {
    return null;
  }

  const bounds = new LngLatBounds();
  const appendCoordinate = (coordinate: unknown) => {
    if (Array.isArray(coordinate) && typeof coordinate[0] === "number") {
      bounds.extend(coordinate as [number, number]);
      return;
    }
    if (Array.isArray(coordinate)) {
      coordinate.forEach(appendCoordinate);
    }
  };
  appendCoordinate(geometry.coordinates);

  if (bounds.isEmpty()) {
    return null;
  }

  const center = bounds.getCenter();
  return [center.lng, center.lat] as [number, number];
}

function formatPopupProperties(properties?: Record<string, unknown>) {
  if (!properties) {
    return "<div style='color:#0f1f33;font-family:IBM Plex Sans Arabic,sans-serif;'>لا توجد خصائص متاحة.</div>";
  }

  const rows = Object.entries(properties)
    .map(
      ([key, value]) =>
        `<div style="display:flex;gap:12px;justify-content:space-between;border-bottom:1px solid rgba(15,31,51,0.08);padding:6px 0;"><strong>${key}</strong><span>${String(value)}</span></div>`,
    )
    .join("");

  return `<div dir="rtl" style="min-width:220px;color:#0f1f33;font-family:IBM Plex Sans Arabic,sans-serif;">${rows}</div>`;
}

export function MapView({
  layers,
  selectedFeature,
}: {
  layers: MapLayerPayload[];
  selectedFeature: SelectedFeaturePayload | null;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const visibleLayers = useMemo(
    () => layers.filter((layer) => layer.visible),
    [layers],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [34.466, 31.525],
      zoom: 11,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-left");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
      }),
      "top-left",
    );

    mapRef.current = map;
    popupRef.current = new maplibregl.Popup({ closeButton: true, closeOnClick: false });

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const syncLayers = () => {
      layers.forEach((layer) => {
        const sourceId = `${layer.slug}-source`;
        const layerId = `${layer.slug}-layer`;

        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: "geojson",
            data: layer.collection,
          });
        } else {
          const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
          source.setData(layer.collection);
        }

        if (!map.getLayer(layerId)) {
          map.addLayer(buildMapLayerConfig(layer, sourceId, layerId));

          map.on("click", layerId, (event) => {
            const feature = event.features?.[0];
            if (!feature || !popupRef.current) {
              return;
            }

            popupRef.current
              .setLngLat(event.lngLat)
              .setHTML(
                formatPopupProperties(
                  feature.properties as Record<string, unknown> | undefined,
                ),
              )
              .addTo(map);
          });

          map.on("mouseenter", layerId, () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", layerId, () => {
            map.getCanvas().style.cursor = "";
          });
        }

        map.setLayoutProperty(
          layerId,
          "visibility",
          layer.visible ? "visible" : "none",
        );

        if (layer.geometryType === "point") {
          map.setPaintProperty(layerId, "circle-opacity", layer.opacity);
        } else if (layer.geometryType === "line") {
          map.setPaintProperty(layerId, "line-opacity", layer.opacity);
        } else {
          map.setPaintProperty(layerId, "fill-opacity", layer.opacity);
        }
      });
    };

    if (map.isStyleLoaded()) {
      syncLayers();
      return;
    }

    map.once("load", syncLayers);
  }, [layers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedFeature) {
      return;
    }

    const center = getFeatureCenter(selectedFeature);
    if (!center) {
      return;
    }

    map.flyTo({ center, zoom: 14, essential: true });
    popupRef.current
      ?.setLngLat(center)
      .setHTML(formatPopupProperties(selectedFeature.properties))
      .addTo(map);
  }, [selectedFeature]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || visibleLayers.length === 0) {
      return;
    }

    const bounds = new LngLatBounds();

    visibleLayers.forEach((layer) => {
      layer.collection.features.forEach((feature) => {
        const center = getFeatureCenter({
          id: String(feature.id ?? ""),
          properties: feature.properties ?? undefined,
          geometry: feature.geometry,
        });
        if (center) {
          bounds.extend(center);
        }
      });
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 48, maxZoom: 13, duration: 0 });
    }
  }, [visibleLayers]);

  return <div className="h-full min-h-[540px] w-full" ref={containerRef} />;
}
