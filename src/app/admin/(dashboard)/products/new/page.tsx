import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-blush-900">Add Product</h1>
      <ProductForm />
    </div>
  );
}
