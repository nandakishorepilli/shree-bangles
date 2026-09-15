import { getAllProductsForAdmin } from "@/services/productService";
import { PRODUCT_STATUS } from "@/lib/status";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const products = await getAllProductsForAdmin();

  const published = products.filter((p) => p.status === PRODUCT_STATUS.PUBLISHED).length;
  const outOfStock = products.filter((p) => p.stock <= 0 && p.variants.length === 0).length;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-blush-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Products" value={products.length} />
        <StatCard label="Published" value={published} />
        <StatCard label="Out of Stock" value={outOfStock} />
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/admin/products/new" className="rounded-full bg-blush-600 px-6 py-2.5 text-sm font-medium text-white">
          + Add Product
        </Link>
        <Link href="/admin/kundams" className="rounded-full border border-blush-300 px-6 py-2.5 text-sm font-medium text-blush-700">
          Manage Kundan Designs
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-blush-100 bg-white p-5">
      <p className="text-sm text-blush-500">{label}</p>
      <p className="mt-1 font-display text-3xl text-blush-900">{value}</p>
    </div>
  );
}
