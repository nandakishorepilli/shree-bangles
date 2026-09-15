"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { getWhatsappOrderUrl } from "@/lib/business";

type Kundan = { id: string; name: string; image: string; description: string | null };

const COLORS = ["Black", "White", "Blue", "Red", "Pink", "Green", "Violet", "Orange", "Yellow", "Gold"];
const SHADES = ["Light", "Normal", "Dark"] as const;

export function CustomBangleDesigner({ kundams }: { kundams: Kundan[] }) {
  const [selectedKundans, setSelectedKundans] = useState<Kundan[]>([]);
  const [addingAnother, setAddingAnother] = useState(true);
  const [color, setColor] = useState<string | null>(null);
  const [shade, setShade] = useState<(typeof SHADES)[number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);

  const selectedIds = new Set(selectedKundans.map((kundan) => kundan.id));
  const canAddAnother = kundams.some((kundan) => !selectedIds.has(kundan.id));
  const kundanCounts = useMemo(() => {
    return selectedKundans.reduce<Map<string, { kundan: Kundan; quantity: number }>>((counts, kundan) => {
      const existing = counts.get(kundan.id);
      counts.set(kundan.id, { kundan, quantity: (existing?.quantity ?? 0) + 1 });
      return counts;
    }, new Map());
  }, [selectedKundans]);

  function selectKundan(kundan: Kundan) {
    if (selectedIds.has(kundan.id)) return;
    setSelectedKundans((current) => [...current, kundan]);
    setAddingAnother(false);
    setError(null);
  }

  function removeKundan(id: string) {
    setSelectedKundans((current) => {
      const next = current.filter((kundan) => kundan.id !== id);
      if (next.length === 0) setAddingAnother(true);
      return next;
    });
    setRequested(false);
  }

  function requestCustomOrder() {
    if (selectedKundans.length === 0) {
      setError("Please select at least one Kundan.");
      document.getElementById("kundan-selection")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!color || !shade) {
      setError("Please select a bangle colour and shade.");
      document.getElementById("bangle-colour")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const kundanDetails = Array.from(kundanCounts.values())
      .map(({ kundan, quantity }) => `• ${kundan.name} × ${quantity}`)
      .join("\n");
    const whatsappUrl = getWhatsappOrderUrl(`Hello Shree Bangles, I would like to request a custom bangle design.\n\nKundans:\n${kundanDetails}\n\nBangle colour: ${color}\nShade: ${shade}`);

    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setRequested(true);
      setError(null);
    }
  }

  return (
    <section id="custom-designer" className="rounded-3xl border border-blush-100 bg-cream-50 p-5 sm:p-8">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-600">Create your set</p>
        <h1 className="mt-2 font-display text-3xl text-blush-900 sm:text-4xl">Custom Bangle Designer</h1>
        <p className="mt-3 text-blush-700">Choose your Kundans, then select one shared bangle colour for your complete design.</p>
      </div>

      {kundams.length === 0 ? (
        <p className="rounded-xl bg-blush-50 p-5 text-center text-blush-600">New Kundan designs are being added. Please check back soon.</p>
      ) : (
        <div className="space-y-10">
          <div id="kundan-selection">
            <h2 className="font-display text-2xl text-blush-900">1. Select Kundans</h2>
            <p className="mt-1 text-sm text-blush-500">Start with a Kundan, then add another design if you would like to combine them.</p>
            <div id="kundan-options" className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kundams.map((kundan) => {
                const isSelected = selectedIds.has(kundan.id);
                const canSelect = addingAnother && !isSelected;
                return <article key={kundan.id} className={`overflow-hidden rounded-xl border bg-white transition ${isSelected ? "border-gold-500 ring-1 ring-gold-400" : "border-blush-100"}`}>
                  <div className="relative aspect-[4/3] bg-blush-50"><Image src={kundan.image} alt={kundan.name} fill className="object-cover" /></div>
                  <div className="p-4"><h3 className="font-display text-xl text-blush-900">{kundan.name}</h3>{kundan.description && <p className="mt-1 min-h-10 text-sm text-blush-500">{kundan.description}</p>}<button type="button" onClick={() => selectKundan(kundan)} disabled={!canSelect} className={`mt-4 w-full rounded-full px-4 py-2.5 text-sm font-medium transition ${isSelected ? "bg-gold-400 text-blush-900" : canSelect ? "bg-blush-600 text-cream-50 hover:bg-blush-700" : "cursor-not-allowed bg-blush-100 text-blush-400"}`}>{isSelected ? "Selected" : addingAnother ? "Select Kundan" : "Select another Kundan to continue"}</button></div>
                </article>;
              })}
            </div>

            {selectedKundans.length > 0 && <div className="mt-6 rounded-2xl bg-blush-50 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-2xl text-blush-900">Selected Kundans</h3><p className="mt-1 text-sm text-blush-500">Remove an item to adjust your design.</p></div><button type="button" onClick={() => { setSelectedKundans([]); setAddingAnother(true); setRequested(false); }} className="text-sm text-blush-600 hover:underline">Clear all</button></div><div className="mt-4 flex flex-wrap gap-3">{selectedKundans.map((kundan) => <div key={kundan.id} className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-sm text-blush-800 shadow-sm"><Image src={kundan.image} alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" /><span>{kundan.name}</span><button type="button" aria-label={`Remove ${kundan.name}`} onClick={() => removeKundan(kundan.id)} className="text-blush-500 hover:text-blush-800">×</button></div>)}</div>{canAddAnother && !addingAnother && <button type="button" onClick={() => { setAddingAnother(true); document.getElementById("kundan-options")?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="mt-5 rounded-full border border-blush-300 bg-white px-5 py-2.5 text-sm font-medium text-blush-700 hover:border-blush-500">+ Add Another Kundan</button>}</div>}
          </div>

          {selectedKundans.length > 0 && <div id="bangle-colour"><h2 className="font-display text-2xl text-blush-900">2. Choose bangle colour</h2><p className="mt-1 text-sm text-blush-500">This shared colour and shade will apply to the entire custom design.</p><div className="mt-5 flex flex-wrap gap-2">{COLORS.map((item) => <button key={item} type="button" onClick={() => { setColor(item); setRequested(false); }} className={`rounded-full border px-4 py-2 text-sm ${color === item ? "border-blush-600 bg-blush-600 text-white" : "border-blush-200 bg-white text-blush-700 hover:border-blush-400"}`}>{item}</button>)}</div>{color && <div className="mt-4"><p className="text-sm font-medium text-blush-700">Choose shade</p><div className="mt-2 flex flex-wrap gap-2">{SHADES.map((item) => <button key={item} type="button" onClick={() => { setShade(item); setRequested(false); }} className={`rounded-full border px-4 py-2 text-sm ${shade === item ? "border-gold-500 bg-gold-400 text-blush-900" : "border-blush-200 bg-white text-blush-700 hover:border-gold-400"}`}>{item}</button>)}</div></div>}</div>}

          <div id="custom-review" className="rounded-2xl border border-gold-300 bg-white p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl text-blush-900">Your Custom Bangle</h2><button type="button" onClick={() => document.getElementById("kundan-selection")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="text-sm text-blush-600 hover:underline">Change selections</button></div>{selectedKundans.length === 0 ? <p className="mt-3 text-blush-500">Select at least one Kundan to review your design.</p> : <div className="mt-4 space-y-3 text-blush-800"><div><p className="font-medium">Kundans</p><ul className="mt-2 space-y-1 text-sm">{Array.from(kundanCounts.values()).map(({ kundan, quantity }) => <li key={kundan.id}>{kundan.name} <span className="text-blush-500">× {quantity}</span></li>)}</ul></div><div><p className="font-medium">Bangle colour</p><p className="mt-1 text-sm">{color && shade ? `${shade} ${color}` : "Choose a colour and shade"}</p></div></div>}{error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}{requested && <p className="mt-4 rounded-lg bg-blush-50 p-3 text-sm text-blush-700">WhatsApp has opened with your custom order request.</p>}<button type="button" onClick={requestCustomOrder} className="mt-6 w-full rounded-full bg-blush-600 px-7 py-3 font-medium text-cream-50 hover:bg-blush-700 sm:w-auto">Request Custom Order</button></div>
        </div>
      )}
    </section>
  );
}
