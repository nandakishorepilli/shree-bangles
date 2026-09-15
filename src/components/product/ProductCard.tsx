import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { ProductWithRelations } from "@/types";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const cover = product.images[0]?.url ?? "/placeholders/bangle-placeholder.svg";
  // Standard sizes share the product's stock level.
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block animate-fade-in-up overflow-hidden rounded-2xl border border-blush-100 bg-white transition-shadow hover:shadow-lg hover:shadow-blush-100"
    >
      <div className="relative aspect-square overflow-hidden bg-blush-50">
        <Image
          src={cover}
          alt={product.images[0]?.altText ?? product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {product.salePrice && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-medium text-white">
            Sale
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-blush-900/80 px-3 py-1 text-xs font-medium text-white">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="mt-1 font-display text-lg text-blush-900">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold text-blush-700">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          {product.salePrice && (
            <span className="text-sm text-blush-300 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
