import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface CatalogFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  categories: string[];
  types: string[];
}

export function CatalogFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  type,
  onTypeChange,
  categories,
  types,
}: CatalogFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="ابحث في الكتالوج..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-glass pr-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-ghost btn-sm shrink-0 ${showFilters ? "bg-[rgba(34,211,238,0.08)] border-[rgba(34,211,238,0.2)]" : ""}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          فلتر
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-up">
          <div className="flex-1">
            <label className="block text-xs font-bold text-[var(--muted)] mb-1.5">
              التصنيف
            </label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="select-glass"
            >
              <option value="">الكل</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-[var(--muted)] mb-1.5">
              النوع
            </label>
            <select
              value={type}
              onChange={(e) => onTypeChange(e.target.value)}
              className="select-glass"
            >
              <option value="">الكل</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
