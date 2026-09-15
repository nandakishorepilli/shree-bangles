import { notFound } from "next/navigation";
import { getProductById } from "@/services/productService";
import { ProductForm } from "@/components/admin/ProductForm";

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-blush-900">Edit Product</h1>
      <ProductForm initialProduct={product} />
    </div>
  );
}
