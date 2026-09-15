import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/productService";
import { formatPrice } from "@/lib/utils";
import { ProductDetailActions } from "@/components/product/ProductDetailActions";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <div className="grid gap-10 py-10 md:grid-cols-2">
      <ProductImageGallery images={product.images} productName={product.name} />

      <div>
        <p className="text-xs uppercase tracking-wider text-gold-600">Shree Bangles</p>
        <h1 className="mt-1 font-display text-3xl text-blush-900">{product.name}</h1>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-2xl font-semibold text-blush-700">{formatPrice(product.salePrice ?? product.price)}</span>
          {product.salePrice && <span className="text-blush-300 line-through">{formatPrice(product.price)}</span>}
        </div>
        <p className="mt-6 leading-relaxed text-blush-800">{product.description}</p>

        <div className="mt-8">
          <ProductDetailActions product={product} />
        </div>
      </div>
    </div>
  );
}
