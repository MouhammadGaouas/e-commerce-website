"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
  totalResults: number;
}

export default function ProductFilters({
  categories,
  totalResults,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "featured";
  const currentQuery = searchParams.get("q") || "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all" || value === "featured") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 mb-8">
      {/* Search Filter Tag (if active) */}
      {currentQuery && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Search results for:</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-950/60 border border-blue-800/80 px-2.5 py-1 text-xs font-medium text-blue-300">
            &ldquo;{currentQuery}&rdquo;
            <button
              onClick={clearSearch}
              type="button"
              className="hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Pills Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => updateParam("category", "all")}
            className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              currentCategory === "all"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white"
            }`}
          >
            All Products
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => updateParam("category", cat)}
              className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                currentCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Section: Results Counter & Sort Selector */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-400">
            {totalResults} {totalResults === 1 ? "product" : "products"}
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 hidden sm:inline-block" />
            <select
              value={currentSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              aria-label="Sort products"
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

