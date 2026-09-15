"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { STANDARD_BANGLE_SIZES } from "@/lib/bangleSizes";
import { PRODUCT_STATUS, type ProductStatus } from "@/lib/status";
import type { ProductWithRelations } from "@/types";

interface ImageEntry {
  id: string;
  url?: string;
  previewUrl: string;
  altText?: string;
  file?: File;
  state: "uploaded" | "uploading" | "failed";
  uploadError?: string;
}
interface VariantEntry { color?: string; size?: string; stock: number; }
interface Props { initialProduct?: ProductWithRelations; }

export function ProductForm({ initialProduct }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
  const [salePrice, setSalePrice] = useState(initialProduct?.salePrice?.toString() ?? "");
  const [stock, setStock] = useState(initialProduct?.stock?.toString() ?? "0");
  const [status, setStatus] = useState<ProductStatus>((initialProduct?.status as ProductStatus | undefined) ?? PRODUCT_STATUS.DRAFT);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? false);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.isNewArrival ?? false);
  const [isBestseller, setIsBestseller] = useState(initialProduct?.isBestseller ?? false);
  const [images, setImages] = useState<ImageEntry[]>(initialProduct?.images.map((image) => ({
    id: image.id, url: image.url, previewUrl: image.url, altText: image.altText ?? undefined, state: "uploaded" as const
  })) ?? []);
  const [variants, setVariants] = useState<VariantEntry[]>(initialProduct?.variants.map((variant) => ({
    color: variant.color ?? undefined, size: variant.size ?? undefined, stock: variant.stock
  })) ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const blobUrls = useRef(new Set<string>());
  const uploading = images.some((image) => image.state === "uploading");

  useEffect(() => () => blobUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  function getErrorMessage(data: unknown, fallback: string) {
    if (data && typeof data === "object" && "error" in data) {
      const error = (data as { error?: unknown }).error;
      if (typeof error === "string") return error;
      if (error && typeof error === "object" && "formErrors" in error) {
        const formErrors = (error as { formErrors?: unknown }).formErrors;
        if (Array.isArray(formErrors) && formErrors.every((value) => typeof value === "string")) return formErrors.join(", ");
        const fieldErrors = (error as { fieldErrors?: unknown }).fieldErrors;
        if (fieldErrors && typeof fieldErrors === "object") {
          const messages = Object.values(fieldErrors).flat().filter((value): value is string => typeof value === "string");
          if (messages.length) return messages.join(", ");
        }
      }
    }
    return fallback;
  }

  async function uploadImage(id: string, file: File) {
    setImages((previous) => previous.map((image) => image.id === id ? { ...image, state: "uploading", uploadError: undefined } : image));
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) throw new Error(getErrorMessage(data, `Upload failed (${res.status})`));
      if (!data || typeof data !== "object" || typeof (data as { url?: unknown }).url !== "string") {
        throw new Error("Upload succeeded but the server did not return an image URL");
      }
      const url = (data as { url: string }).url;
      if (!url.startsWith("/api/uploads/")) throw new Error("Upload returned an invalid image URL");
      setImages((previous) => previous.map((image) => {
        if (image.id !== id) return image;
        if (image.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(image.previewUrl);
          blobUrls.current.delete(image.previewUrl);
        }
        return { ...image, url, previewUrl: url, file: undefined, state: "uploaded", uploadError: undefined };
      }));
    } catch (error) {
      setImages((previous) => previous.map((image) => image.id === id ? {
        ...image, state: "failed", uploadError: error instanceof Error ? error.message : "Upload failed"
      } : image));
    }
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    const id = crypto.randomUUID();
    blobUrls.current.add(previewUrl);
    setSubmitError(null);
    setImages((previous) => [...previous, { id, previewUrl, altText: name, file, state: "uploading" }]);
    await uploadImage(id, file);
  }

  function removeImage(id: string) {
    setImages((previous) => {
      const image = previous.find((entry) => entry.id === id);
      if (image?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(image.previewUrl);
        blobUrls.current.delete(image.previewUrl);
      }
      return previous.filter((entry) => entry.id !== id);
    });
  }
  function addVariant() { setVariants((previous) => [...previous, { color: "", stock: 0 }]); }
  function updateVariant(index: number, patch: Partial<VariantEntry>) { setVariants((previous) => previous.map((variant, i) => i === index ? { ...variant, ...patch } : variant)); }
  function removeVariant(index: number) { setVariants((previous) => previous.filter((_, i) => i !== index)); }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const incompleteUpload = images.find((image) => image.state !== "uploaded" || !image.url);
    if (incompleteUpload) {
      setSubmitError(incompleteUpload.uploadError ? "Retry or remove the image whose upload failed before creating this product." : "Please wait for image uploads to finish before creating this product.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const payload = {
      name, description, price: Number(price), salePrice: salePrice ? Number(salePrice) : null, stock: Number(stock),
      status, isFeatured, isNewArrival, isBestseller,
      images: images.map(({ url, altText }) => ({ url: url!, altText })),
      variants: variants.filter((variant) => variant.color || variant.size)
    };
    try {
      const url = isEditing ? `/api/products/${initialProduct!.id}` : "/api/products";
      const res = await fetch(url, { method: isEditing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(getErrorMessage(await res.json().catch(() => null), `Could not save product (${res.status})`));
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save product");
    } finally {
      setSubmitting(false);
    }
  }

  return <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
    {submitError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{submitError}</p>}
    <Field label="Name"><input value={name} onChange={(event) => setName(event.target.value)} required className="input" /></Field>
    <Field label="Description"><textarea value={description} onChange={(event) => setDescription(event.target.value)} required rows={4} className="input" /></Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Price (₹)"><input type="number" min={0} step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required className="input" /></Field>
      <Field label="Sale Price (₹, optional)"><input type="number" min={0} step="0.01" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} className="input" /></Field>
    </div>
    <div><Field label="Stock"><input type="number" min={0} value={stock} onChange={(event) => setStock(event.target.value)} required className="input" /></Field><p className="mt-1 text-xs text-blush-500">This stock is shared across all standard bangle sizes: {STANDARD_BANGLE_SIZES.join(", ")}.</p></div>
    <Field label="Status"><select value={status} onChange={(event) => setStatus(event.target.value as ProductStatus)} className="input"><option value={PRODUCT_STATUS.DRAFT}>Draft</option><option value={PRODUCT_STATUS.PUBLISHED}>Published</option><option value={PRODUCT_STATUS.HIDDEN}>Hidden</option></select></Field>
    <div className="flex flex-wrap gap-6"><Checkbox label="Featured" checked={isFeatured} onChange={setIsFeatured} /><Checkbox label="New Arrival" checked={isNewArrival} onChange={setIsNewArrival} /><Checkbox label="Bestseller" checked={isBestseller} onChange={setIsBestseller} /></div>
    <Field label="Images">
      <div className="mb-3 flex flex-wrap gap-3">{images.map((image) => <div key={image.id} className="relative h-20 w-20 overflow-hidden rounded-lg border border-blush-200">
        <Image src={image.previewUrl} alt={image.altText ?? ""} fill className="object-cover" unoptimized={image.previewUrl.startsWith("blob:")} />
        <button type="button" onClick={() => removeImage(image.id)} className="absolute right-0 top-0 bg-black/50 px-1 text-xs text-white">×</button>
        {image.state === "uploading" && <span className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-center text-[10px] text-white">Uploading…</span>}
        {image.state === "failed" && <button type="button" onClick={() => image.file && uploadImage(image.id, image.file)} className="absolute inset-x-0 bottom-0 bg-red-700/90 p-1 text-[10px] text-white">Retry upload</button>}
      </div>)}</div>
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} />
      {uploading && <p className="mt-1 text-xs text-blush-400">Uploading...</p>}
      {images.filter((image) => image.state === "failed").map((image) => <p key={`${image.id}-error`} className="mt-1 text-xs text-red-600">Image upload failed: {image.uploadError}</p>)}
    </Field>
    <Field label="Colour variants (optional)"><div className="space-y-2">{variants.map((variant, index) => <div key={index} className="flex items-center gap-2"><input placeholder="Color" value={variant.color ?? ""} onChange={(event) => updateVariant(index, { color: event.target.value })} className="input" /><input type="number" min={0} placeholder="Stock" value={variant.stock} onChange={(event) => updateVariant(index, { stock: Number(event.target.value) })} className="input w-24" /><button type="button" onClick={() => removeVariant(index)} className="text-red-500">Remove</button></div>)}<button type="button" onClick={addVariant} className="text-sm text-blush-600 hover:underline">+ Add Colour Variant</button></div></Field>
    <button type="submit" disabled={submitting || uploading} className="rounded-full bg-blush-600 px-8 py-3 font-medium text-white hover:bg-blush-700 disabled:opacity-60">{submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}</button>
    <style jsx global>{`.input { width: 100%; border: 1px solid #f6cdd6; border-radius: 0.5rem; padding: 0.5rem 0.75rem; } .input:focus { outline: none; border-color: #d85575; }`}</style>
  </form>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1 block text-sm font-medium text-blush-700">{label}</span>{children}</label>; }
function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center gap-2 text-sm text-blush-700"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>; }
