import Image from "next/image";

export function HandmadeSection() {
  return (
    <section className="grid items-center gap-10 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src="/artisan-hands.png"
          alt="Hands crafting bangles"
          fill
          className="object-cover"
        />
      </div>
      <div>
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gold-600">Our Craft</p>
        <h2 className="font-display text-3xl text-blush-900">Handmade With Love</h2>
        <p className="mt-4 text-blush-800">
          Shree Bangles brings together styles for celebrations, gifting, and everyday elegance.
          Explore details and colours chosen to complement your look.
        </p>
      </div>
    </section>
  );
}
