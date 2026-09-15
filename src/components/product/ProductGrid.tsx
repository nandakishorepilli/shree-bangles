import { ProductCard } from "./ProductCard";
import type { ProductWithRelations } from "@/types";

export function ProductGrid({ products }: { products: ProductWithRelations[] }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-blush-400">
        New designs are coming soon. Please check back shortly.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
