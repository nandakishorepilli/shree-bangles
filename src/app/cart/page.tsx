"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { lines, subtotal, updateQuantity, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-display text-3xl text-blush-900">Your bag is empty</h1>
        <p className="mt-2 text-blush-500">Explore the collection and find something beautiful.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-blush-600 px-8 py-3 text-cream-50">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="mb-8 font-display text-3xl text-blush-900">Your Bag</h1>
      <div className="grid gap-10 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {lines.map((line) => (
            <div
              key={`${line.productId}-${line.color}-${line.size}`}
              className="flex gap-4 rounded-xl border border-blush-100 p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-blush-50">
                <Image src={line.image ?? "/placeholders/bangle-placeholder.svg"} alt={line.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="font-display text-lg text-blush-900">{line.name}</p>
                    <p className="text-sm text-blush-400">
                      {[line.color, line.size].filter(Boolean).join(" / ")}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(line.productId, line.color, line.size)}
                    className="text-sm text-blush-400 hover:text-blush-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      className="h-7 w-7 rounded-full border border-blush-200 text-blush-700"
                      onClick={() => updateQuantity(line.productId, line.color, line.size, line.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{line.quantity}</span>
                    <button
                      className="h-7 w-7 rounded-full border border-blush-200 text-blush-700 disabled:opacity-30"
                      disabled={line.quantity >= line.maxStock}
                      onClick={() => updateQuantity(line.productId, line.color, line.size, line.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-medium text-blush-700">{formatPrice(line.price * line.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-blush-100 p-6">
          <div className="flex justify-between text-blush-800">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-blush-400">Shipping and taxes calculated at checkout.</p>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-blush-600 py-3 text-center font-medium text-cream-50 hover:bg-blush-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
