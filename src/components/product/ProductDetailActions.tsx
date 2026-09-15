"use client";

import { useEffect, useMemo, useState } from "react";
import { STANDARD_BANGLE_SIZES } from "@/lib/bangleSizes";
import { getWhatsappOrderUrl } from "@/lib/business";
import { formatPrice } from "@/lib/utils";
import { BangleAddToCartButton } from "@/components/cart/BangleAddToCartButton";
import { useCart } from "@/context/CartContext";
import type { ProductWithRelations } from "@/types";

export function ProductDetailActions({ product }: { product: ProductWithRelations }) {
  const { addItem, lines } = useCart();
  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((variant) => variant.color).filter(Boolean))) as string[],
    [product.variants]
  );
  const [color, setColor] = useState<string | undefined>(colors[0]);
  const [size, setSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const hasSizeVariants = product.variants.some((variant) => variant.size !== null);
  const selectedVariant = size
    ? product.variants.find((variant) =>
        (variant.color ?? undefined) === color &&
        (hasSizeVariants ? variant.size === size : variant.size === null)
      )
    : undefined;
  const selectedStock = product.variants.length > 0
    ? selectedVariant?.stock ?? 0
    : product.stock;
  const inventoryLines = lines.filter((line) =>
    selectedVariant
      ? line.variantId === selectedVariant.id
      : !line.variantId && line.productId === product.id
  );
  const remainingStock = Math.max(0, selectedStock - inventoryLines.reduce((total, line) => total + line.quantity, 0));
  const outOfStock = Boolean(size) && remainingStock <= 0;
  const sellingPrice = product.salePrice ?? product.price;
  const total = sellingPrice * quantity;
  const orderMessage = [
    "Hello Shree Bangles!", "", "I would like to order:", "",
    `Product: ${product.name}`, `Price: ${formatPrice(sellingPrice)}`,
    `Size: ${size ?? "Not selected"}`, `Quantity: ${quantity}`,
    `Total: ${formatPrice(total)}`, color ? `Colour: ${color}` : null, "",
    "Please confirm availability and order details."
  ].filter((line): line is string => line !== null).join("\n");
  const whatsappUrl = getWhatsappOrderUrl(orderMessage);
  const canAddToCart = Boolean(size) && remainingStock > 0;
  const canOrder = canAddToCart && Boolean(whatsappUrl);

  useEffect(() => {
    setQuantity((current) => Math.max(1, Math.min(current, Math.max(1, remainingStock))));
  }, [remainingStock]);

  function changeQuantity(nextQuantity: number) {
    setQuantity(Math.max(1, Math.min(nextQuantity, remainingStock)));
  }

  function addToCart() {
    if (!canAddToCart) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      slug: product.slug,
      price: sellingPrice,
      image: product.images[0]?.url ?? null,
      color,
      size,
      quantity,
      maxStock: selectedStock
    });
  }

  function stockForSize(option: string) {
    const optionVariant = product.variants.find((variant) =>
      (variant.color ?? undefined) === color &&
      (hasSizeVariants ? variant.size === option : variant.size === null)
    );
    const optionStock = product.variants.length > 0 ? optionVariant?.stock ?? 0 : product.stock;
    const inCart = lines
      .filter((line) => optionVariant ? line.variantId === optionVariant.id : !line.variantId && line.productId === product.id)
      .reduce((total, line) => total + line.quantity, 0);

    return optionStock - inCart;
  }

  return (
    <div className="space-y-6">
      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-blush-700">Colour</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((option) => <button key={option} type="button" onClick={() => setColor(option)} className={`rounded-full border px-4 py-1.5 text-sm ${color === option ? "border-blush-600 bg-blush-600 text-white" : "border-blush-200 text-blush-700"}`}>{option}</button>)}
          </div>
        </div>
      )}
      <div>
        <p className="mb-2 text-sm font-medium text-blush-700">Bangle Size</p>
        <div className="flex flex-wrap gap-2">
          {STANDARD_BANGLE_SIZES.map((option) => {
            const optionSoldOut = stockForSize(option) <= 0;
            return <button key={option} type="button" onClick={() => setSize(option)} disabled={optionSoldOut} className={`rounded-full border px-4 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${size === option ? "border-blush-600 bg-blush-600 text-white" : "border-blush-200 text-blush-700 hover:border-blush-500"}`}>{option}</button>;
          })}
        </div>
        {!size && <p className="mt-2 text-xs text-blush-500">Please select a bangle size to add this item to your bag.</p>}
      </div>
      {size && <p className="text-sm font-medium text-blush-500">{outOfStock ? "Out of Stock" : `${remainingStock} available`}</p>}
      <div>
        <p className="mb-2 text-sm font-medium text-blush-700">Quantity</p>
        <div className="flex w-fit items-center rounded-full border border-blush-200">
          <button type="button" onClick={() => changeQuantity(quantity - 1)} disabled={!size || outOfStock || quantity <= 1} className="px-4 py-2 text-blush-700 disabled:opacity-40" aria-label="Decrease quantity">−</button>
          <span className="min-w-10 text-center text-sm text-blush-800">{quantity}</span>
          <button type="button" onClick={() => changeQuantity(quantity + 1)} disabled={!size || outOfStock || quantity >= remainingStock} className="px-4 py-2 text-blush-700 disabled:opacity-40" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <BangleAddToCartButton onAdd={addToCart} disabled={!canAddToCart} label={!size ? "Select a Bangle Size" : outOfStock ? "Out of Stock" : "Add to Cart"} />
      {canOrder ? (
        <a href={whatsappUrl!} target="_blank" rel="noreferrer" className="inline-flex rounded-full border-2 border-gold-500 bg-blush-500 px-6 py-3 font-medium tracking-wide text-cream-50 transition-colors hover:bg-blush-600">Order on WhatsApp</a>
      ) : (
        <button type="button" disabled className="inline-flex cursor-not-allowed rounded-full border-2 border-blush-200 bg-blush-100 px-6 py-3 font-medium tracking-wide text-blush-400">
          {outOfStock ? "Out of Stock" : !size ? "Select a Bangle Size" : "WhatsApp Ordering Unavailable"}
        </button>
      )}
    </div>
  );
}
