import { useEffect, useMemo, useState } from "react";
import type { FeatureCollection, Geometry } from "geojson";
import { useSearchParams } from "react-router-dom";
import { FeatureSearchPanel, type MapSearchResult } from "@/features/map/FeatureSearchPanel";
import { LayerControlPanel } from "@/features/map/LayerControlPanel";
import {
  MapView,
  type MapLayerPayload,
} from "@/features/map/MapView";
import { searchPreviewFeatures } from "@/features/map/searchPreviewFeatures";
import { demoLayerDetails } from "@/data/demo/layerDetails";

interface SearchFeatureRecord {
  id: string;
  layerName: string;
  properties?: Record<string, unknown>;
  geometry?: Geometry | null;
}

export function MapPage() {
  const [searchParams] = useSearchParams();
  const publicLayers = useMemo(
    () => demoLayerDetails.filter((layer) => layer.isPublic),
    [],
  );
  const initialLayer =
    searchParams.get("layer") && publicLayers.some((layer) => layer.slug === searchParams.get("layer"))
      ? searchParams.get("layer")!
      : publicLayers[0]?.slug ?? "";

  const [activeLayerSlugs, setActiveLayerSlugs] = useState<string[]>(
    initialLayer ? [initialLayer] : [],
  );
  const [opacityByLayer, setOpacityByLayer] = useState<Record<string, number>>(
    () =>
      Object.fromEntries(publicLayers.map((layer) => [layer.slug, 0.72])),
  );
  const [collectionsByLayer, setCollectionsByLayer] = useState<
    Record<string, FeatureCollection>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeature, setSelectedFeature] =
    useState<SearchFeatureRecord | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all(
      publicLayers.map(async (layer) => {
        const response = await fetch(layer.previewGeoJsonUrl);
        const collection =
          (await response.json()) as FeatureCollection<Geometry>;
        return [layer.slug, collection] as const;
      }),
    ).then((entries) => {
      if (!isMounted) {
        return;
      }

      setCollectionsByLayer(Object.fromEntries(entries));
    });

    return () => {
      isMounted = false;
    };
  }, [publicLayers]);

  const mapLayers = useMemo<MapLayerPayload[]>(
    () =>
      publicLayers.map((layer) => ({
        slug: layer.slug,
        name: layer.name,
        geometryType: layer.geometryType as "point" | "line" | "polygon",
        opacity: opacityByLayer[layer.slug] ?? 0.72,
        visible: activeLayerSlugs.includes(layer.slug),
        collection:
          collectionsByLayer[layer.slug] ?? {
            type: "FeatureCollection",
            features: [],
          },
      })),
    [activeLayerSlugs, collectionsByLayer, opacityByLayer, publicLayers],
  );

  const searchableFeatures = useMemo<SearchFeatureRecord[]>(
    () =>
      publicLayers.flatMap((layer) => {
        const collection = collectionsByLayer[layer.slug];
        if (!collection) {
          return [];
        }

        return collection.features.map((feature, index) => ({
          id: String(feature.id ?? `${layer.slug}-${index}`),
          layerName: layer.name,
          properties: feature.properties ?? undefined,
          geometry: feature.geometry,
        }));
      }),
    [collectionsByLayer, publicLayers],
  );

  const searchResults = useMemo<MapSearchResult[]>(
    () =>
      searchPreviewFeatures(searchableFeatures, searchQuery).map((feature) => ({
        id: feature.id,
        layerName:
          searchableFeatures.find((candidate) => candidate.id === feature.id)
            ?.layerName ?? "طبقة",
        title:
          String(feature.properties?.name ?? feature.properties?.title ?? "معلم"),
        properties: feature.properties,
      })),
    [searchQuery, searchableFeatures],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-950">الخريطة التفاعلية</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600">
          شغّل الطبقات المنشورة، عدّل شفافيتها، وابحث داخل خصائص المعالم
          الموجودة في المعاينة مباشرة.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
          {activeLayerSlugs.length} طبقة فعالة
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <FeatureSearchPanel
            query={searchQuery}
            results={searchResults}
            onQueryChange={setSearchQuery}
            onSelectResult={(result) => {
              const match = searchableFeatures.find(
                (feature) => feature.id === result.id,
              );
              if (match) {
                setSelectedFeature(match);
              }
            }}
          />
          <LayerControlPanel
            activeLayerSlugs={activeLayerSlugs}
            layers={publicLayers}
            opacityByLayer={opacityByLayer}
            onOpacityChange={(slug, opacity) =>
              setOpacityByLayer((current) => ({ ...current, [slug]: opacity }))
            }
            onToggleLayer={(slug) =>
              setActiveLayerSlugs((current) =>
                current.includes(slug)
                  ? current.filter((value) => value !== slug)
                  : [...current, slug],
              )
            }
          />
        </aside>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
          <MapView layers={mapLayers} selectedFeature={selectedFeature} />
        </div>
      </div>
    </section>
  );
}
