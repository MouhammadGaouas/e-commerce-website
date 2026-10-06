import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import AddToCartButton from "@/components/products/AddToCartButton";
import ProductCard from "@/components/products/ProductCard";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return {
      title: "Product Not Found | ModernStore",
    };
  }

  return {
    title: `${product.name} | ModernStore`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
    take: 4,
  });

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link href="/products" className="hover:text-white transition-colors">
          Products
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-white transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-slate-200 truncate max-w-[200px] sm:max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600">
              <ShoppingBag className="h-20 w-20" />
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] flex items-center justify-center">
              <span className="rounded-xl bg-red-950/90 border border-red-800 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-red-200">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category Tag */}
            <div>
              <span className="inline-block rounded-full bg-blue-950/60 border border-blue-800/70 px-3 py-1 text-xs font-semibold text-blue-300">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {product.name}
            </h1>

            {/* Price & Stock Row */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                ${product.price.toFixed(2)}
              </span>

              <div className="flex items-center gap-1.5 text-xs font-medium">
                {isOutOfStock ? (
                  <span className="text-red-400">Sold out</span>
                ) : isLowStock ? (
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    Only {product.stock} items remaining
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    In stock ({product.stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-800/80">
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
                About this item
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {product.description}
              </p>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="pt-6 border-t border-slate-800/80 space-y-6">
            <AddToCartButton productId={product.id} stock={product.stock} />

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/60 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-400 shrink-0" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-blue-400 shrink-0" />
                <span>30-Day Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-slate-800">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Related Products
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              More items you might like in {product.category}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

