import Link from "next/link";
import { getAllProductsForAdmin } from "@/services/productService";
import { ProductsTable } from "@/components/admin/ProductsTable";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl text-blush-900">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-blush-600 px-6 py-2.5 text-sm font-medium text-white">
          + Add Product
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
