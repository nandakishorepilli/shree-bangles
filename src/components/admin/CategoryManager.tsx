"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types";

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Could not create category");
      }
      setName("");
      setDescription("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create category");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-xl border border-blush-100 bg-white p-5">
        <h2 className="mb-4 font-display text-lg text-blush-900">Existing Categories</h2>
        <ul className="space-y-2">
          {initialCategories.map((c) => (
            <li key={c.id} className="border-b border-blush-50 pb-2 text-sm">
              <p className="font-medium text-blush-800">{c.name}</p>
              {c.description && <p className="text-blush-400">{c.description}</p>}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="h-fit rounded-xl border border-blush-100 bg-white p-5">
        <h2 className="mb-4 font-display text-lg text-blush-900">Add Category</h2>
        {error && <p className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}
        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-blush-700">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-blush-200 px-3 py-2" />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-blush-700">Description (optional)</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-blush-200 px-3 py-2" />
        </label>
        <button type="submit" disabled={submitting} className="rounded-full bg-blush-600 px-6 py-2 text-sm font-medium text-white disabled:opacity-60">
          {submitting ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}
