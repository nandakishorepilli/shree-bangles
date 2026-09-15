"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      customerName: formData.get("customerName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
      items: lines.map((l) => ({
        productId: l.productId,
        productName: l.name,
        price: l.price,
        quantity: l.quantity,
        color: l.color,
        size: l.size
      }))
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Could not place order");
      }
      clearCart();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return <p className="py-24 text-center text-blush-500">Your bag is empty. Add something before checking out.</p>;
  }

  return (
    <div className="grid gap-10 py-10 md:grid-cols-3">
      <form onSubmit={handleSubmit} className="space-y-4 md:col-span-2">
        <h1 className="mb-4 font-display text-3xl text-blush-900">Checkout</h1>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <Input name="customerName" label="Full Name" required />
        <Input name="email" label="Email" type="email" required />
        <Input name="phone" label="Phone" required />
        <Input name="address" label="Address" required />
        <div className="grid grid-cols-3 gap-4">
          <Input name="city" label="City" required />
          <Input name="state" label="State" required />
          <Input name="pincode" label="Pincode" required />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-full bg-blush-600 py-3 font-medium text-cream-50 hover:bg-blush-700 disabled:opacity-60"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
        <p className="text-xs text-blush-400">
          Payment integration is not yet connected — this places the order as &quot;Pending&quot; for manual follow-up.
        </p>
      </form>

      <div className="h-fit rounded-xl border border-blush-100 p-6">
        <h2 className="mb-4 font-display text-xl text-blush-900">Order Summary</h2>
        {lines.map((l) => (
          <div key={`${l.productId}-${l.color}-${l.size}`} className="mb-2 flex justify-between text-sm">
            <span>
              {l.name} × {l.quantity}
            </span>
            <span>{formatPrice(l.price * l.quantity)}</span>
          </div>
        ))}
        <div className="mt-4 flex justify-between border-t border-blush-100 pt-4 font-semibold text-blush-800">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-blush-700">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-blush-200 px-3 py-2 focus:border-blush-500 focus:outline-none"
      />
    </label>
  );
}
