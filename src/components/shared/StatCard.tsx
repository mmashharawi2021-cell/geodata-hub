import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ label, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)] flex items-center justify-center shrink-0">
        <div className="w-5 h-5 text-[#22d3ee]">
          {icon}
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
          {label}
        </p>
        <p className="text-xl font-extrabold tracking-tight mt-0.5">
          {value}
        </p>
        {trend && (
          <p className={`text-[0.6rem] font-bold mt-0.5 ${trendUp ? "text-emerald-400" : "text-rose-400"}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
