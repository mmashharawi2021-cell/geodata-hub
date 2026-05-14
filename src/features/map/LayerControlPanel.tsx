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
    <section className="surface-strong rounded-lg p-4">
      <h2 className="text-base font-bold text-slate-950">الطبقات</h2>
      <div className="mt-4 space-y-3">
        {layers.map((layer) => {
          const isActive = activeLayerSlugs.includes(layer.slug);

          return (
            <article
              key={layer.slug}
              className="rounded-md border border-slate-200 bg-slate-50 p-3"
            >
              <label className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">{layer.name}</div>
                  <div className="text-xs text-slate-500">{layer.category}</div>
                </div>
                <input
                  className="accent-[var(--accent)]"
                  checked={isActive}
                  type="checkbox"
                  onChange={() => onToggleLayer(layer.slug)}
                />
              </label>
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span>الشفافية</span>
                  <span>{Math.round((opacityByLayer[layer.slug] ?? 0.75) * 100)}%</span>
                </div>
                <input
                  className="w-full accent-[var(--accent)]"
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
