import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/services/productService";
import { formatPrice } from "@/lib/utils";
import { ProductDetailActions } from "@/components/product/ProductDetailActions";

interface Props {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const cover = product.images[0]?.url ?? "/placeholders/bangle-placeholder.svg";

  return (
    <div className="grid gap-10 py-10 md:grid-cols-2">
      <div className="space-y-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-blush-50">
          <Image src={cover} alt={product.images[0]?.altText ?? product.name} fill className="object-cover" priority />
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {product.images.slice(1).map((img) => (
              <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg bg-blush-50">
                <Image src={img.url} alt={img.altText ?? product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

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
