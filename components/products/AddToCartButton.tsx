"use client";

import { useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export default function AddToCartButton({ stock }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // Trigger visual added animation
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const increment = () => {
    if (quantity < stock) setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector (when in stock) */}
      {!isOutOfStock && (
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Quantity
          </span>
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900">
            <button
              type="button"
              onClick={decrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="p-2.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center font-semibold text-sm text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increment}
              disabled={quantity >= stock}
              aria-label="Increase quantity"
              className="p-2.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
          isOutOfStock
            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60"
            : isAdded
            ? "bg-emerald-600 text-white shadow-emerald-600/20"
            : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25 active:scale-[0.99]"
        }`}
      >
        {isOutOfStock ? (
          "Currently Unavailable"
        ) : isAdded ? (
          <>
            <Check className="h-4 w-4 stroke-[3]" />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}

