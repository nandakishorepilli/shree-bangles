import { getProducts } from "@/services/productService";
import { ProductGrid } from "@/components/product/ProductGrid";

interface Props {
  searchParams: { category?: string; filter?: "newArrival" | "bestseller" | "featured"; search?: string };
}

export default async function ShopPage({ searchParams }: Props) {
  const products = await getProducts({ categorySlug: searchParams.category, search: searchParams.search, newArrival: searchParams.filter === "newArrival", bestseller: searchParams.filter === "bestseller", featured: searchParams.filter === "featured" });

  return (
    <div className="py-10">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-600">The Collection</p>
        <h1 className="font-display text-4xl text-blush-900">Shop All Bangles</h1>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
