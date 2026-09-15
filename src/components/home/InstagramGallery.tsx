import Image from "next/image";

// Placeholder tiles. Later this can be swapped for a real Instagram Graph
// API feed or a curated list managed from the admin dashboard.
const PLACEHOLDER_TILES = Array.from({ length: 6 }, (_, i) => `/placeholders/instagram-${(i % 3) + 1}.svg`);

export function InstagramGallery() {
  return (
    <section>
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-600">Follow Along</p>
        <h2 className="font-display text-3xl text-blush-900">Instagram (placeholder)</h2>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-6">
        {PLACEHOLDER_TILES.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
            <Image src={src} alt="Instagram placeholder tile" fill className="object-cover transition-transform hover:scale-105" />
          </div>
        ))}
      </div>
    </section>
  );
}
