"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { STANDARD_BANGLE_SIZES } from "@/lib/bangleSizes";
import type { ProductWithRelations } from "@/types";

interface ImageEntry {
  url: string;
  altText?: string;
}

interface VariantEntry {
  color?: string;
  // Preserved for existing legacy records, but standard sizes are not entered
  // in this form. New products use the global size configuration instead.
  size?: string;
  stock: number;
}

interface Props {
  initialProduct?: ProductWithRelations; // present when editing
}

/**
 * One form component handles both "create" and "edit" flows — the only
 * difference is which HTTP method/endpoint it calls on submit. Keeping this
 * as a single component avoids duplicating the (fairly large) product field
 * set across two files.
 */
export function ProductForm({ initialProduct }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
  const [salePrice, setSalePrice] = useState(initialProduct?.salePrice?.toString() ?? "");
  const [stock, setStock] = useState(initialProduct?.stock?.toString() ?? "0");
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? false);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.isNewArrival ?? false);
  const [isBestseller, setIsBestseller] = useState(initialProduct?.isBestseller ?? false);
  const [images, setImages] = useState<ImageEntry[]>(
    initialProduct?.images.map((i) => ({ url: i.url, altText: i.altText ?? undefined })) ?? []
  );
  const [variants, setVariants] = useState<VariantEntry[]>(
    initialProduct?.variants.map((v) => ({ color: v.color ?? undefined, size: v.size ?? undefined, stock: v.stock })) ?? []
  );

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImages((prev) => [...prev, { url: data.url, altText: name }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function addVariant() {
    setVariants((prev) => [...prev, { color: "", stock: 0 }]);
  }

  function updateVariant(index: number, patch: Partial<VariantEntry>) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      description,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      stock: Number(stock),
      isFeatured,
      isNewArrival,
      isBestseller,
      images,
      variants: variants.filter((v) => v.color || v.size)
    };

    try {
      const url = isEditing ? `/api/products/${initialProduct!.id}` : "/api/products";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error?.formErrors?.join(", ") || body.error || "Could not save product");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <Field label="Name">
        <input value={name} onChange={(e) => setName(e.target.value)} required className="input" />
      </Field>

      <Field label="Description">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="input" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₹)">
          <input type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="input" />
        </Field>
        <Field label="Sale Price (₹, optional)">
          <input type="number" min={0} step="0.01" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="input" />
        </Field>
      </div>

      <div>
        <Field label="Stock">
          <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} required className="input" />
        </Field>
        <p className="mt-1 text-xs text-blush-500">
          This stock is shared across all standard bangle sizes: {STANDARD_BANGLE_SIZES.join(", ")}.
        </p>
      </div>

      <div className="flex flex-wrap gap-6">
        <Checkbox label="Featured" checked={isFeatured} onChange={setIsFeatured} />
        <Checkbox label="New Arrival" checked={isNewArrival} onChange={setIsNewArrival} />
        <Checkbox label="Bestseller" checked={isBestseller} onChange={setIsBestseller} />
      </div>

      <Field label="Images">
        <div className="mb-3 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-blush-200">
              <Image src={img.url} alt={img.altText ?? ""} fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute right-0 top-0 bg-black/50 px-1 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={handleFileSelect} disabled={uploading} />
        {uploading && <p className="mt-1 text-xs text-blush-400">Uploading...</p>}
      </Field>

      <Field label="Colour variants (optional)">
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                placeholder="Color"
                value={v.color ?? ""}
                onChange={(e) => updateVariant(i, { color: e.target.value })}
                className="input"
              />
              <input
                type="number"
                min={0}
                placeholder="Stock"
                value={v.stock}
                onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                className="input w-24"
              />
              <button type="button" onClick={() => removeVariant(i)} className="text-red-500">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="text-sm text-blush-600 hover:underline">
            + Add Colour Variant
          </button>
        </div>
      </Field>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="rounded-full bg-blush-600 px-8 py-3 font-medium text-white hover:bg-blush-700 disabled:opacity-60"
      >
        {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #f6cdd6;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
        }
        .input:focus {
          outline: none;
          border-color: #d85575;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-blush-700">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-blush-700">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
