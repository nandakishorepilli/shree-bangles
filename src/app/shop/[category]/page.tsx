import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/services/categoryService";
import { getProducts } from "@/services/productService";
import { ProductGrid } from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

interface Props {
  params: { category: string };
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();

  const products = await getProducts({ categorySlug: category.slug });

  return (
    <div className="py-10">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-600">Collection</p>
        <h1 className="font-display text-4xl text-blush-900">{category.name}</h1>
        {category.description && <p className="mt-2 text-blush-500">{category.description}</p>}
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
