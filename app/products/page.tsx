import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import { PackageX } from "lucide-react";
import Link from "next/link";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
  }>;
}

export const metadata = {
  title: "All Products | ModernStore",
  description: "Browse our complete catalog of curated electronics, apparel, and home essentials.",
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, sort, q } = await searchParams;

  // Build Prisma where query filters
  const where: any = {};

  if (category && category !== "all") {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  if (q && q.trim()) {
    where.OR = [
      { name: { contains: q.trim(), mode: "insensitive" } },
      { description: { contains: q.trim(), mode: "insensitive" } },
    ];
  }

  // Build Prisma orderBy sort criteria
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

  // Fetch products and distinct categories concurrently
  const [products, categoryResults] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
    }),
    prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const categories = categoryResults.map((c) => c.category).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {category && category !== "all" ? category : "All Products"}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Discover our curated collection of high-quality electronics, apparel, and lifestyle items.
        </p>
      </div>

      {/* Filter Toolbar */}
      <ProductFilters categories={categories} totalResults={products.length} />

      {/* Products Grid or Empty State */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-16 text-center">
          <div className="rounded-full bg-slate-800/80 p-4 text-slate-500 mb-4">
            <PackageX className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-semibold text-white">No products found</h3>
          <p className="mt-1 text-sm text-slate-400 max-w-sm">
            We couldn&apos;t find any items matching your current filters. Try searching with different keywords or reset your filters.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-md"
          >
            Reset Filters
          </Link>
        </div>
      )}
    </div>
  );
}

