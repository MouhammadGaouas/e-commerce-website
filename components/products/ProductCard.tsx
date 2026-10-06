import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  stock: number;
  category: string;
}

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-950/20 transition-all duration-300">
      {/* Product Image Container */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square w-full overflow-hidden bg-slate-950"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-600 bg-slate-950">
            <ShoppingBag className="h-12 w-12" />
          </div>
        )}

        {/* Stock / Category Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-slate-950/75 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-slate-800">
            {product.category}
          </span>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="rounded-lg bg-red-950/90 border border-red-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-200">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Card Info Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product.id}`} className="group-hover:text-blue-400 transition-colors">
          <h3 className="font-semibold text-slate-100 text-base line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Price & Stock Status Row */}
        <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-white tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {isOutOfStock ? (
              <span className="text-red-400 font-medium">Sold out</span>
            ) : isLowStock ? (
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                In stock
              </span>
            )}
          </div>
        </div>

        {/* View Details Action Link */}
        <Link
          href={`/products/${product.id}`}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-slate-800/80 px-3.5 py-2.5 text-xs font-medium text-slate-200 hover:bg-blue-600 hover:text-white transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

