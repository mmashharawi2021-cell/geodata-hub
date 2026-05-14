import { useState, useMemo } from "react";
import {
  Globe,
  Database,
  Map,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  Layers3,
  Flag,
} from "lucide-react";
import {
  arabCountries,
  REGIONS,
  totalArabCountries,
  totalDataSources,
  totalRegions,
  type ArabCountry,
  type DataSource,
} from "@/data/arabCountries";

const TYPE_ICONS: Record<string, string> = {
  boundaries: "🗺️",
  roads: "🛣️",
  places: "📍",
  osm: "🧭",
  humanitarian: "🤝",
  raster: "🛰️",
  admin: "📋",
};

const TYPE_LABELS: Record<string, string> = {
  boundaries: "حدود",
  roads: "طرق",
  places: "معالم",
  osm: "OSM",
  humanitarian: "إنساني",
  raster: "فضائي",
  admin: "إداري",
};

function DataSourceBadge({ type }: { type: DataSource["type"] }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-[0.6rem] font-bold text-[var(--muted)] backdrop-blur-sm">
      {TYPE_ICONS[type] || "📦"} {TYPE_LABELS[type] || type}
    </span>
  );
}

function DataSourceRow({ source }: { source: DataSource }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-[var(--border)] bg-[rgba(34,211,238,0.03)] p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-[var(--foreground)]">{source.titleAr}</p>
          <p className="text-[0.7rem] text-[var(--muted)]">{source.sourceName}</p>
        </div>
        <DataSourceBadge type={source.type} />
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem] text-[var(--muted)]">
        <span className="rounded bg-[var(--card)] px-1.5 py-0.5 font-semibold">
          {source.format}
        </span>
        <span>{source.licenseNote}</span>
        <span>{source.updateNote}</span>
      </div>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-center gap-1.5 self-start rounded-lg bg-[rgba(34,211,238,0.08)] px-3 py-1 text-[0.7rem] font-bold text-[#22d3ee] transition-colors hover:bg-[rgba(34,211,238,0.14)]"
      >
        <ExternalLink className="h-3 w-3" />
        زيارة المصدر
      </a>
    </div>
  );
}

function CountryCard({ country }: { country: ArabCountry }) {
  const [expanded, setExpanded] = useState(false);
  const mapUrl = `https://www.openstreetmap.org/?query=${encodeURIComponent(country.nameEn)}#map=6/${country.iso2 === "PS" ? "31.9" : "24"}/`;

  return (
    <div className="glass-card group rounded-2xl p-5 animate-fade-up">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg">{country.iso2 === "PS" ? "🇵🇸" : country.iso2 === "JO" ? "🇯🇴" : country.iso2 === "LB" ? "🇱🇧" : country.iso2 === "SY" ? "🇸🇾" : country.iso2 === "IQ" ? "🇮🇶" : country.iso2 === "SA" ? "🇸🇦" : country.iso2 === "KW" ? "🇰🇼" : country.iso2 === "BH" ? "🇧🇭" : country.iso2 === "QA" ? "🇶🇦" : country.iso2 === "AE" ? "🇦🇪" : country.iso2 === "OM" ? "🇴🇲" : country.iso2 === "YE" ? "🇾🇪" : country.iso2 === "EG" ? "🇪🇬" : country.iso2 === "SD" ? "🇸🇩" : country.iso2 === "LY" ? "🇱🇾" : country.iso2 === "TN" ? "🇹🇳" : country.iso2 === "DZ" ? "🇩🇿" : country.iso2 === "MA" ? "🇲🇦" : country.iso2 === "MR" ? "🇲🇷" : country.iso2 === "SO" ? "🇸🇴" : country.iso2 === "DJ" ? "🇩🇯" : "🇰🇲"}</span>
            <h3 className="text-base font-extrabold leading-tight">{country.nameAr}</h3>
            <span className="badge text-[0.55rem]">{country.iso3}</span>
          </div>
          <p className="text-[0.7rem] text-[var(--muted)]">
            {country.nameEn} · {country.capitalAr}
          </p>
        </div>
        <span className="shrink-0 rounded-lg bg-[rgba(34,211,238,0.06)] px-2 py-1 text-[0.55rem] font-bold text-[#22d3ee]">
          {country.region}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {Array.from(new Set(country.dataSources.map((s) => s.type))).map((type) => (
          <DataSourceBadge key={type} type={type} />
        ))}
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-[0.6rem] font-bold text-[var(--muted)] backdrop-blur-sm">
          <Database className="h-3 w-3" />
          {country.dataSources.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="btn-ghost btn-sm flex-1"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          {expanded ? "إخفاء المصادر" : "عرض المصادر"}
        </button>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost btn-sm"
        >
          <Map className="h-4 w-4" />
          فتح في الخريطة
        </a>
      </div>

      {expanded && (
        <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
          {country.dataSources.map((source, i) => (
            <DataSourceRow key={i} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ArabDataPage() {
  const [search, setSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState<string>("all");

  const filtered = useMemo(() => {
    return arabCountries.filter((c) => {
      const matchRegion = activeRegion === "all" || c.region === activeRegion;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        c.nameAr.includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.iso2.toLowerCase().includes(q) ||
        c.iso3.toLowerCase().includes(q);
      return matchRegion && matchSearch;
    });
  }, [activeRegion, search]);

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">بيانات الدول العربية</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              كتالوج مفتوح لمصادر البيانات الجغرافية للدول العربية الـ 22
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)]">
            <Globe className="h-5 w-5 text-[#22d3ee]" />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "دولة عربية", value: totalArabCountries, icon: <Flag className="h-5 w-5" /> },
            { label: "مصدر بيانات", value: totalDataSources, icon: <Database className="h-5 w-5" /> },
            { label: "إقليم", value: totalRegions, icon: <Layers3 className="h-5 w-5" /> },
            { label: "مصادر مفتوحة", value: "100%", icon: <ExternalLink className="h-5 w-5" /> },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl px-5 py-4 flex items-center gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)]">
                <div className="h-5 w-5 text-[#22d3ee]">{stat.icon}</div>
              </div>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-xl font-extrabold tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن دولة..."
              className="input-glass pr-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveRegion("all")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                activeRegion === "all"
                  ? "bg-[#22d3ee] text-[#031d36] shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[rgba(34,211,238,0.2)]"
              }`}
            >
              الكل
            </button>
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  activeRegion === region
                    ? "bg-[#22d3ee] text-[#031d36] shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                    : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[rgba(34,211,238,0.2)]"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Search className="h-10 w-10 text-[var(--muted)]" />
            <p className="text-sm text-[var(--muted)]">لا توجد دول مطابقة</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveRegion("all");
              }}
              className="btn-ghost btn-sm"
            >
              إعادة تعيين الفلتر
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center text-xs text-[var(--muted)] backdrop-blur-sm">
          جميع المصادر المذكورة أعلاه هي مصادر بيانات مفتوحة (Open Data) ومتاحة للعموم.
          <br />
          الروابط تشير إلى الموارد الرسمية لكل مصدر. لا يتم تخزين أي ملفات بيانات ضخمة داخل هذه المنصة.
        </div>
      </div>
    </div>
  );
}
