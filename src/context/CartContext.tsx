"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { CartLine } from "@/types";

const STORAGE_KEY = "bangle-boutique-cart";

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (line: CartLine) => void;
  updateQuantity: (productId: string | undefined, variantId: string | undefined, color: string | undefined, size: string | undefined, quantity: number, customization?: CartLine["customization"]) => void;
  removeItem: (productId: string | undefined, variantId: string | undefined, color: string | undefined, size: string | undefined, customization?: CartLine["customization"]) => void;
  clearCart: () => void;
  isBagAnimating: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string | undefined, variantId?: string, color?: string, size?: string, customization?: CartLine["customization"]) {
  return `${productId ?? "custom"}::${variantId ?? ""}::${color ?? ""}::${size ?? ""}::${customization ? JSON.stringify(customization) : ""}`;
}

function inventoryKey(line: CartLine) {
  return line.variantId ? `variant::${line.variantId}` : `product::${line.productId ?? "custom"}`;
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
      const key = lineKey(newLine.productId, newLine.variantId, newLine.color, newLine.size, newLine.customization);
      const existing = prev.find((l) => lineKey(l.productId, l.variantId, l.color, l.size, l.customization) === key);
      const otherQuantity = prev
        .filter((line) => inventoryKey(line) === inventoryKey(newLine) && lineKey(line.productId, line.variantId, line.color, line.size, line.customization) !== key)
        .reduce((total, line) => total + line.quantity, 0);
      if (existing) {
        return prev.map((l) =>
          lineKey(l.productId, l.variantId, l.color, l.size, l.customization) === key
            ? { ...l, quantity: Math.min(l.quantity + newLine.quantity, Math.max(0, newLine.maxStock - otherQuantity)) }
            : l
        );
      }
      return [...prev, { ...newLine, quantity: Math.min(newLine.quantity, Math.max(0, newLine.maxStock - otherQuantity)) }]
        .filter((line) => line.quantity > 0);
    });
    triggerBagAnimation();
  }

  function updateQuantity(productId: string | undefined, variantId: string | undefined, color: string | undefined, size: string |undefined, quantity: number, customization?: CartLine["customization"]) {
    const key = lineKey(productId, variantId, color, size, customization);
    setLines((prev) =>
      prev
        .map((l) => {
          if (lineKey(l.productId, l.variantId, l.color, l.size, l.customization) !== key) return l;
          const otherQuantity = prev
            .filter((other) => inventoryKey(other) === inventoryKey(l) && lineKey(other.productId, other.variantId, other.color, other.size, other.customization) !== key)
            .reduce((total, other) => total + other.quantity, 0);
          return { ...l, quantity: Math.min(quantity, Math.max(0, l.maxStock - otherQuantity)) };
        })
        .filter((l) => l.quantity > 0)
    );
  }

  function removeItem(productId: string | undefined, variantId: string | undefined, color: string | undefined, size: string | undefined, customization?: CartLine["customization"]) {
    const key = lineKey(productId, variantId, color, size, customization);
    setLines((prev) => prev.filter((l) => lineKey(l.productId, l.variantId, l.color, l.size, l.customization) !== key));
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
