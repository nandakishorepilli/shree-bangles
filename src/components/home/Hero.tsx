import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-blush-100">
      <div className="bg-paisley-faint absolute inset-0" />
      <div className="relative grid items-center gap-8 px-6 py-14 sm:px-12 sm:py-20 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gold-600">Handmade &middot; Heritage &middot; Elegance</p>
          <h1 className="font-display text-4xl leading-tight text-blush-900 sm:text-5xl">
            Bangles that carry the story of tradition, made for today.
          </h1>
          <p className="mt-4 max-w-md text-blush-800">
            Each piece is handcrafted by Indian artisans, blending timeless motifs with a
            modern, minimal touch — placeholder copy, ready for your real brand story.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-blush-600 px-8 py-3 font-medium text-cream-50 transition-colors hover:bg-blush-700"
          >
            Explore the Collection
          </Link>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl">
          {/* Placeholder hero image — replace with real photography of an
              Indian model wearing the bangles once available. */}
          <Image
            src="/placeholders/hero-model.svg"
            alt="Model wearing handmade Indian bangles (placeholder)"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
