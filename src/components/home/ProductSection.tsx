import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductWithRelations } from "@/types";

interface Props {
  title: string;
  subtitle?: string;
  products: ProductWithRelations[];
  viewAllHref?: string;
}

/**
 * One reusable section powers New Arrivals, Best Sellers, and Featured
 * Collection on the homepage — they only differ in which filtered product
 * list is passed in from app/page.tsx.
 */
export function ProductSection({ title, subtitle, products, viewAllHref }: Props) {
  return (
    <section>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl text-blush-900">{title}</h2>
          {subtitle && <p className="mt-1 text-blush-500">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm font-medium text-gold-600 hover:text-gold-700">
            View All &rarr;
          </Link>
        )}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
