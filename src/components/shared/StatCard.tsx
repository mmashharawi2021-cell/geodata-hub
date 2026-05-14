export function StatCard({
  value,
  label,
  hint,
}: {
  value: string;
  label: string;
  hint: string;
}) {
  return (
    <article className="surface-strong rounded-lg p-4">
      <div className="text-2xl font-bold text-slate-950">{value}</div>
      <div className="mt-1 text-sm font-semibold text-slate-700">{label}</div>
      <div className="mt-2 text-sm leading-6 text-slate-500">{hint}</div>
    </article>
  );
}
