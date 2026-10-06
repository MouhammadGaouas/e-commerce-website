import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Headphones,
  Shirt,
  Home,
} from "lucide-react";

export default async function HomePage() {
  // Fetch latest featured products from database
  const featuredProducts = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const categories = [
    {
      name: "Electronics",
      description: "Audio, peripherals, and high-performance smart gadgets.",
      href: "/products?category=Electronics",
      icon: Headphones,
      gradient: "from-blue-600/20 to-indigo-600/20 border-blue-800/40",
    },
    {
      name: "Apparel",
      description: "Organic cotton basics, commuter bags, and all-weather wear.",
      href: "/products?category=Apparel",
      icon: Shirt,
      gradient: "from-emerald-600/20 to-teal-600/20 border-emerald-800/40",
    },
    {
      name: "Home & Living",
      description: "Artisan ceramics, workspace lamps, and ambient scents.",
      href: "/products?category=Home",
      icon: Home,
      gradient: "from-amber-600/20 to-orange-600/20 border-amber-800/40",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-blue-950/30 via-slate-950 to-slate-950 py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-800/60 bg-blue-950/60 px-4 py-1.5 text-xs font-medium text-blue-300 shadow-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>New Season Catalog Available Now</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Next-Gen Essentials, Engineered for Modern Living.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Discover a curated collection of premium electronics, everyday technical apparel, and crafted home goods designed for durability and minimalist elegance.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all active:scale-[0.99]"
            >
              Browse Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products?category=Electronics"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 px-7 py-3.5 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
            >
              Explore Electronics
            </Link>
          </div>
        </div>
      </section>

      {/* Category Tiles Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Curated Categories
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Explore items organized by lifestyle collections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${cat.gradient} p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 w-fit text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore category</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Top picks designed for performance and aesthetic quality.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
            <p className="text-sm">No featured products found yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Run <code className="text-slate-300">npm run seed</code> to populate the catalog.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-md"
          >
            Browse All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="border-t border-slate-800 bg-slate-900/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="rounded-xl bg-blue-950/60 border border-blue-800/60 p-3 text-blue-400 shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Free Global Shipping</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Fast, tracked express delivery on all orders over $50 with real-time tracking updates.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="rounded-xl bg-blue-950/60 border border-blue-800/60 p-3 text-blue-400 shrink-0">
                <RotateCcw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">30-Day Money Back</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Hassle-free return policy. If you aren&apos;t completely satisfied, return it with zero friction.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="rounded-xl bg-blue-950/60 border border-blue-800/60 p-3 text-blue-400 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Secure Checkout</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  256-bit encrypted transactions protecting your personal data and payment safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
