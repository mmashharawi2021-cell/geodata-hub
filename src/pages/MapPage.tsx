import { useState, useCallback, useMemo } from "react";
import { MapView } from "@/features/map/MapView";
import { LayerControlPanel } from "@/features/map/LayerControlPanel";
import { FeatureSearchPanel, type MapSearchResult } from "@/features/map/FeatureSearchPanel";
import type { LayerListItem } from "@/types/layers";
import { Map, Layers3, Search, PanelRightOpen } from "lucide-react";
import { env } from "@/lib/env";
import { demoLayerDetails } from "@/data/demo/layerDetails";

type PanelTab = "layers" | "search";

const demoLayers: LayerListItem[] = demoLayerDetails;

export function MapPage() {
  const { isDemoMode } = env;
  const layers = useMemo(() => isDemoMode ? demoLayers : [], [isDemoMode]);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set());
  const [panelTab, setPanelTab] = useState<PanelTab>("layers");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MapSearchResult[]>([]);

  const handleLayerToggle = useCallback((layerId: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layerId)) next.delete(layerId);
      else next.add(layerId);
      return next;
    });
  }, []);

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const q = query.toLowerCase();
      const results: MapSearchResult[] = layers
        .filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.description?.toLowerCase().includes(q) ||
            l.category?.toLowerCase().includes(q),
        )
        .slice(0, 10)
        .map((l) => ({
          id: l.id,
          layerName: l.name,
          title: l.name,
        }));
      setSearchResults(results);
    },
    [layers],
  );

  const handleSelectResult = useCallback(
    (result: MapSearchResult) => {
      const layer = layers.find((l) => l.id === result.id);
      if (layer) {
        setActiveLayers((prev) => new Set(prev).add(layer.id));
      }
      setPanelTab("layers");
    },
    [layers],
  );

  return (
    <div className="h-[calc(100vh-4.5rem)] pt-18 relative">
      <div className="absolute inset-0 m-3 sm:m-4 rounded-2xl overflow-hidden glass-panel-strong">
        <div className="absolute top-3 right-3 left-3 z-10 flex items-center gap-2">
          <div className="glass-panel rounded-xl px-3 py-2 flex items-center gap-2">
            <Map className="w-4 h-4 text-[#22d3ee]" />
            <span className="text-xs font-bold">GeoData Hub Map</span>
          </div>

          <div className="mr-auto flex items-center gap-1">
            <button
              onClick={() => { setPanelTab("layers"); setSidebarOpen(true); }}
              className={`btn-ghost btn-sm ${panelTab === "layers" && sidebarOpen ? "bg-[rgba(34,211,238,0.08)]" : ""}`}
            >
              <Layers3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setPanelTab("search"); setSidebarOpen(true); }}
              className={`btn-ghost btn-sm ${panelTab === "search" && sidebarOpen ? "bg-[rgba(34,211,238,0.08)]" : ""}`}
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className={`btn-ghost btn-sm ${sidebarOpen ? "bg-[rgba(34,211,238,0.08)]" : ""}`}
              title={sidebarOpen ? "إخفاء الشريط" : "إظهار الشريط"}
            >
              <PanelRightOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        <MapView
          layers={layers}
          activeLayers={activeLayers}
          onReady={() => {}}
        />

        {sidebarOpen && (
          <div className="absolute top-16 left-3 bottom-3 w-72 z-10 animate-slide-right">
            <div className="h-full glass-panel-strong rounded-xl overflow-hidden flex flex-col">
              <div className="flex border-b border-[var(--border)]">
                <button
                  onClick={() => setPanelTab("layers")}
                  className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
                    panelTab === "layers"
                      ? "text-[#22d3ee] border-b-2 border-[#22d3ee]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  الطبقات
                </button>
                <button
                  onClick={() => setPanelTab("search")}
                  className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
                    panelTab === "search"
                      ? "text-[#22d3ee] border-b-2 border-[#22d3ee]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  بحث
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {panelTab === "layers" ? (
                  <LayerControlPanel
                    layers={layers}
                    activeLayers={activeLayers}
                    onLayerToggle={handleLayerToggle}
                  />
                ) : (
                  <FeatureSearchPanel
                    query={searchQuery}
                    results={searchResults}
                    onQueryChange={handleSearchChange}
                    onSelectResult={handleSelectResult}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
