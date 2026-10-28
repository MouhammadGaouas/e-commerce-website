"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDZD } from "@/lib/format";

interface CartProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  stock: number;
  category: string;
}

interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
}

interface CartResponse {
  cart: { id: string; items: CartItem[] } | null;
  items: CartItem[];
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) {
          if (!cancelled) {
            setItems([]);
          }
          return;
        }
        const data: CartResponse = await res.json();
        if (!cancelled) {
          setItems(data.items ?? []);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) {
        setItems([]);
        return;
      }
      const data: CartResponse = await res.json();
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    if (res.ok) {
      await loadCart();
    }
  };

  const removeItem = async (productId: string) => {
    const res = await fetch(`/api/cart?productId=${encodeURIComponent(productId)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await loadCart();
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setIsPlacingOrder(true);
    setOrderError(null);
    try {
      const res = await fetch("/api/orders", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setOrderError(data.message ?? "Failed to place order");
        return;
      }
      router.push("/dashboard");
    } catch {
      setOrderError("Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Shopping Cart
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Review your items before proceeding to checkout.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-16 text-center text-slate-400">
          Loading your cart...
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-16 text-center">
          <div className="rounded-full bg-slate-800/80 p-4 text-slate-500 mb-4">
            <ShoppingCart className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-semibold text-white">Your cart is empty</h3>
          <p className="mt-1 text-sm text-slate-400 max-w-sm">
            Looks like you haven&apos;t added any products to your cart yet. Explore our catalog to find what you need.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-6"
            >
              <Link href={`/products/${item.product.id}`} className="flex items-center gap-5 min-w-0">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                  {item.product.image ? (
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-100 truncate">{item.product.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{item.product.category}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{formatDZD(item.product.price)}</p>
                </div>
              </Link>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950">
                  <button
                    type="button"
                    onClick={() => void updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    aria-label="Decrease quantity"
                    className="px-3 py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-semibold text-white">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => void updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                    aria-label="Increase quantity"
                    className="px-3 py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>

                <p className="text-sm font-semibold text-slate-200 w-20 text-right">
                  {formatDZD(item.product.price * item.quantity)}
                </p>

                <button
                  type="button"
                  onClick={() => void removeItem(item.product.id)}
                  aria-label="Remove item"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/60 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-300">Total</p>
            <p className="text-xl font-bold text-white">{formatDZD(total)}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
            {orderError && (
              <div className="mb-4 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">
                {orderError}
              </div>
            )}
            <button
              type="button"
              onClick={() => void handleCheckout()}
              disabled={isPlacingOrder || items.length === 0}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? "Placing order..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
