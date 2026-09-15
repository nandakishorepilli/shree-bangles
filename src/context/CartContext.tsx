"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { CartLine } from "@/types";

const STORAGE_KEY = "bangle-boutique-cart";

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (line: CartLine) => void;
  updateQuantity: (productId: string, color: string | undefined, size: string | undefined, quantity: number) => void;
  removeItem: (productId: string, color: string | undefined, size: string | undefined) => void;
  clearCart: () => void;
  isBagAnimating: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, color?: string, size?: string) {
  return `${productId}::${color ?? ""}::${size ?? ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isBagAnimating, setIsBagAnimating] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount (client only).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // Corrupt cart data shouldn't crash the app — just start fresh.
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change, after initial hydration.
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function triggerBagAnimation() {
    setIsBagAnimating(true);
    setTimeout(() => setIsBagAnimating(false), 500);
  }

  function addItem(newLine: CartLine) {
    setLines((prev) => {
      const key = lineKey(newLine.productId, newLine.color, newLine.size);
      const existing = prev.find((l) => lineKey(l.productId, l.color, l.size) === key);
      if (existing) {
        return prev.map((l) =>
          lineKey(l.productId, l.color, l.size) === key
            ? { ...l, quantity: Math.min(l.quantity + newLine.quantity, l.maxStock) }
            : l
        );
      }
      return [...prev, newLine];
    });
    triggerBagAnimation();
  }

  function updateQuantity(productId: string, color: string | undefined, size: string | undefined, quantity: number) {
    const key = lineKey(productId, color, size);
    setLines((prev) =>
      prev
        .map((l) => (lineKey(l.productId, l.color, l.size) === key ? { ...l, quantity } : l))
        .filter((l) => l.quantity > 0)
    );
  }

  function removeItem(productId: string, color: string | undefined, size: string | undefined) {
    const key = lineKey(productId, color, size);
    setLines((prev) => prev.filter((l) => lineKey(l.productId, l.color, l.size) !== key));
  }

  function clearCart() {
    setLines([]);
  }

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  return (
    <CartContext.Provider
      value={{ lines, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart, isBagAnimating }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
