"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { getWhatsappOrderUrl } from "@/lib/business";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { lines, subtotal } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappOpened, setWhatsappOpened] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setWhatsappOpened(false);

    try {
      const formData = new FormData(e.currentTarget);
      const customerName = String(formData.get("customerName") ?? "");
      const email = String(formData.get("email") ?? "").trim();
      const phone = String(formData.get("phone") ?? "");
      const address = String(formData.get("address") ?? "");
      const city = String(formData.get("city") ?? "");
      const state = String(formData.get("state") ?? "");
      const pincode = String(formData.get("pincode") ?? "");
      const itemDetails = lines.map((line, index) => {
        const options = [line.color && `Colour: ${line.color}`, line.size && `Size: ${line.size}`].filter(Boolean);
        const customization = line.customization
          ? `\n   Custom details: ${line.customization.kundams.map((kundam) => kundam.name).join(", ")} · ${line.customization.shade} ${line.customization.color}`
          : "";

        return `${index + 1}. ${line.name}\n   ${options.length > 0 ? `${options.join(" | ")}\n   ` : ""}Quantity: ${line.quantity}\n   Price: ${formatPrice(line.price)}\n   Item total: ${formatPrice(line.price * line.quantity)}${customization}`;
      });
      const message = [
        "Hello Shree Bangles! I would like to place an order.",
        "",
        "Customer details",
        `Name: ${customerName}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : null,
        "",
        "Delivery address",
        address,
        `${city}, ${state} - ${pincode}`,
        "",
        "Order items",
        ...itemDetails,
        "",
        `Order subtotal: ${formatPrice(subtotal)}`,
        `Order total: ${formatPrice(subtotal)}`,
        "",
        "Please confirm availability and delivery details."
      ].filter((line): line is string => line !== null).join("\n");
      const whatsappUrl = getWhatsappOrderUrl(message);

      if (!whatsappUrl) throw new Error("WhatsApp ordering is currently unavailable. Please try again later.");

      const whatsappWindow = window.open();
      if (!whatsappWindow) {
        throw new Error("WhatsApp could not be opened. Please allow pop-ups for this site and try again.");
      }

      whatsappWindow.opener = null;
      whatsappWindow.location.href = whatsappUrl;

      setWhatsappOpened(true);
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
        {whatsappOpened && <p className="rounded-lg bg-blush-50 p-3 text-sm text-blush-700">WhatsApp has opened with your order details. Please review the message and press Send in WhatsApp to submit your order.</p>}
        <Input name="customerName" label="Full Name" required />
        <Input name="email" label="Email (optional)" type="email" />
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
          {submitting ? "Opening WhatsApp..." : "Order on WhatsApp"}
        </button>
        <p className="text-xs text-blush-400">
          WhatsApp will open with your order details. Your order is sent only after you press Send in WhatsApp.
        </p>
      </form>

      <div className="h-fit rounded-xl border border-blush-100 p-6">
        <h2 className="mb-4 font-display text-xl text-blush-900">Order Summary</h2>
        {lines.map((l) => (
          <div key={`${l.productId}-${l.variantId}-${l.color}-${l.size}-${JSON.stringify(l.customization)}`} className="mb-2 flex justify-between text-sm">
            <span>
              {l.name} × {l.quantity}
              {l.customization && <span className="block text-xs text-blush-500">{l.customization.kundams.map((kundam) => kundam.name).join(", ")} · {l.customization.shade} {l.customization.color}</span>}
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
