import Image from "next/image";

export function HandmadeSection() {
  return (
    <section className="grid items-center gap-10 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src="/placeholders/artisan-hands.svg"
          alt="Artisan hands crafting bangles (placeholder)"
          fill
          className="object-cover"
        />
      </div>
      <div>
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gold-600">Our Craft</p>
        <h2 className="font-display text-3xl text-blush-900">Handmade With Love</h2>
        <p className="mt-4 text-blush-800">
          Placeholder copy: every bangle passes through the hands of skilled artisans who have
          practiced their craft for generations. From shaping to enamel work, nothing is rushed —
          replace this with your brand&apos;s real story.
        </p>
      </div>
    </section>
  );
}
