"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import type { ProductWithRelations } from "@/types";

export function ProductsTable({ products }: { products: ProductWithRelations[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleStockChange(id: string, stock: number) {
    setPendingId(id);
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock })
    });
    setPendingId(null);
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setPendingId(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setPendingId(null);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-blush-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-blush-100 text-blush-500">
          <tr>
            <th className="p-4">Product</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Flags</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-blush-50 last:border-0">
              <td className="p-4 font-medium text-blush-900">{product.name}</td>
              <td className="p-4 text-blush-800">
                {formatPrice(product.salePrice ?? product.price)}
                {product.salePrice && (
                  <span className="ml-1 text-xs text-blush-300 line-through">{formatPrice(product.price)}</span>
                )}
              </td>
              <td className="p-4">
                <input
                  type="number"
                  min={0}
                  defaultValue={product.stock}
                  disabled={pendingId === product.id}
                  className="w-20 rounded border border-blush-200 px-2 py-1"
                  onBlur={(e) => {
                    const value = Number(e.target.value);
                    if (value !== product.stock) handleStockChange(product.id, value);
                  }}
                />
              </td>
              <td className="p-4 text-xs text-blush-500">
                {[
                  product.isFeatured && "Featured",
                  product.isNewArrival && "New",
                  product.isBestseller && "Bestseller"
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </td>
              <td className="p-4 whitespace-nowrap">
                <Link href={`/admin/products/${product.id}/edit`} className="mr-3 text-blush-600 hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(product.id, product.name)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && <p className="p-6 text-center text-blush-400">No products yet.</p>}
    </div>
  );
}
