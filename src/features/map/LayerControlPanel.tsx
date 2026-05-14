import type { LayerDetails } from "@/types/layers";

export function LayerControlPanel({
  layers,
  activeLayerSlugs,
  opacityByLayer,
  onToggleLayer,
  onOpacityChange,
}: {
  layers: LayerDetails[];
  activeLayerSlugs: string[];
  opacityByLayer: Record<string, number>;
  onToggleLayer: (slug: string) => void;
  onOpacityChange: (slug: string, opacity: number) => void;
}) {
  return (
    <section className="rounded-[1.75rem] border border-white/12 bg-white/8 p-4 backdrop-blur-xl dark:bg-slate-950/30">
      <h2 className="text-lg font-semibold text-white">الطبقات</h2>
      <div className="mt-4 space-y-4">
        {layers.map((layer) => {
          const isActive = activeLayerSlugs.includes(layer.slug);

          return (
            <article
              key={layer.slug}
              className="rounded-2xl border border-white/10 bg-slate-950/30 p-3"
            >
              <label className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-white">{layer.name}</div>
                  <div className="text-xs text-slate-400">{layer.category}</div>
                </div>
                <input
                  checked={isActive}
                  type="checkbox"
                  onChange={() => onToggleLayer(layer.slug)}
                />
              </label>
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                  <span>الشفافية</span>
                  <span>{Math.round((opacityByLayer[layer.slug] ?? 0.75) * 100)}%</span>
                </div>
                <input
                  className="w-full accent-cyan-400"
                  disabled={!isActive}
                  max={1}
                  min={0.15}
                  step={0.05}
                  type="range"
                  value={opacityByLayer[layer.slug] ?? 0.75}
                  onChange={(event) =>
                    onOpacityChange(layer.slug, Number(event.target.value))
                  }
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
