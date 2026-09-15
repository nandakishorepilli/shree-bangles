"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Kundam = { id: string; name: string; image: string; description: string | null; isActive: boolean; sortOrder: number };
type FormState = { name: string; image: string; description: string; isActive: boolean; sortOrder: string };
const blank: FormState = { name: "", image: "", description: "", isActive: true, sortOrder: "0" };

export function KundamManager({ initialKundams }: { initialKundams: Kundam[] }) {
  const router = useRouter();
  const [kundams, setKundams] = useState(initialKundams);
  const [form, setForm] = useState<FormState>(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function change<K extends keyof FormState>(key: K, value: FormState[K]) { setForm((current) => ({ ...current, [key]: value })); }
  function reset() { setForm(blank); setEditingId(null); setError(null); }

  async function upload(file: File) {
    setUploading(true); setError(null);
    try {
      const body = new FormData(); body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json(); change("image", data.url);
    } catch (err) { setError(err instanceof Error ? err.message : "Image upload failed"); }
    finally { setUploading(false); }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true); setError(null);
    try {
      const payload = { ...form, sortOrder: Number(form.sortOrder), description: form.description || undefined };
      const res = await fetch(editingId ? `/api/kundams/${editingId}` : "/api/kundams", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.formErrors?.join(", ") || "Could not save Kundan");
      setKundams((current) => editingId ? current.map((kundam) => kundam.id === editingId ? data.kundam : kundam) : [...current, data.kundam].sort((a, b) => a.sortOrder - b.sortOrder));
      reset(); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save Kundan"); }
    finally { setSaving(false); }
  }

  function edit(kundam: Kundam) { setEditingId(kundam.id); setForm({ name: kundam.name, image: kundam.image, description: kundam.description ?? "", isActive: kundam.isActive, sortOrder: String(kundam.sortOrder) }); }
  async function remove(id: string) { if (!window.confirm("Delete this Kundan design?")) return; const res = await fetch(`/api/kundams/${id}`, { method: "DELETE" }); if (res.ok) { setKundams((current) => current.filter((kundam) => kundam.id !== id)); if (editingId === id) reset(); router.refresh(); } else setError("Could not delete Kundan"); }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4">
        {kundams.length === 0 ? <p className="rounded-xl border border-dashed border-blush-200 p-6 text-blush-500">No Kundan designs yet. Add your first design using the form.</p> : kundams.map((kundam) => (
          <div key={kundam.id} className="flex gap-4 rounded-xl border border-blush-100 bg-white p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-blush-50"><Image src={kundam.image} alt={kundam.name} fill className="object-cover" /></div>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-medium text-blush-900">{kundam.name}</h2><span className={`rounded-full px-2 py-0.5 text-xs ${kundam.isActive ? "bg-green-50 text-green-700" : "bg-blush-100 text-blush-600"}`}>{kundam.isActive ? "Active" : "Inactive"}</span></div>{kundam.description && <p className="mt-1 text-sm text-blush-500">{kundam.description}</p>}<p className="mt-2 text-xs text-blush-400">Sort order: {kundam.sortOrder}</p></div>
            <div className="flex shrink-0 gap-3 text-sm"><button type="button" onClick={() => edit(kundam)} className="text-blush-600 hover:underline">Edit</button><button type="button" onClick={() => remove(kundam.id)} className="text-red-500 hover:underline">Delete</button></div>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="h-fit space-y-4 rounded-xl border border-blush-100 bg-white p-5">
        <h2 className="font-display text-2xl text-blush-900">{editingId ? "Edit Kundan" : "Add Kundan"}</h2>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <label className="block text-sm font-medium text-blush-700">Name<input value={form.name} onChange={(e) => change("name", e.target.value)} required className="mt-1 w-full rounded-lg border border-blush-200 px-3 py-2" /></label>
        <label className="block text-sm font-medium text-blush-700">Description<textarea value={form.description} onChange={(e) => change("description", e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-blush-200 px-3 py-2" /></label>
        <label className="block text-sm font-medium text-blush-700">Image<input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file); }} disabled={uploading} className="mt-1 block w-full text-sm" /></label>
        {form.image && <div className="relative h-28 w-28 overflow-hidden rounded-lg"><Image src={form.image} alt="Kundan preview" fill className="object-cover" /></div>}
        <label className="block text-sm font-medium text-blush-700">Sort order<input type="number" min="0" value={form.sortOrder} onChange={(e) => change("sortOrder", e.target.value)} required className="mt-1 w-full rounded-lg border border-blush-200 px-3 py-2" /></label>
        <label className="flex items-center gap-2 text-sm text-blush-700"><input type="checkbox" checked={form.isActive} onChange={(e) => change("isActive", e.target.checked)} /> Active (visible to customers)</label>
        <div className="flex gap-3"><button type="submit" disabled={saving || uploading || !form.image} className="rounded-full bg-blush-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving..." : editingId ? "Save Changes" : "Add Kundan"}</button>{editingId && <button type="button" onClick={reset} className="text-sm text-blush-600 hover:underline">Cancel</button>}</div>
      </form>
    </div>
  );
}
