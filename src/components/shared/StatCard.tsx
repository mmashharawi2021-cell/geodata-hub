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
    <article className="rounded-[1.75rem] border border-white/14 bg-white/8 p-5 backdrop-blur-xl dark:bg-slate-950/30">
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="mt-2 text-sm font-medium text-slate-100">{label}</div>
      <div className="mt-3 text-sm text-slate-300">{hint}</div>
    </article>
  );
}
