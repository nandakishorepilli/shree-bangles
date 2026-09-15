import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl py-14">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-600">Our Story</p>
        <h1 className="font-display text-4xl text-blush-900">About Shree Bangles</h1>
      </div>
      <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
        <Image src="/placeholders/about-banner.svg" alt="Artisans crafting bangles (placeholder)" fill className="object-cover" />
      </div>
      <div className="space-y-4 leading-relaxed text-blush-800">
        <p>
          Placeholder copy: Shree Bangles began as a small family workshop dedicated to
          preserving the art of handmade Indian bangle-making. Replace this paragraph with the
          real founding story.
        </p>
        <p>
          Placeholder copy: every piece is shaped, painted, and finished by hand — no two bangles
          are ever quite the same. Replace this paragraph with real details about your artisans
          and process.
        </p>
        <p>
          Placeholder copy: today, Shree Bangles blends traditional techniques with
          contemporary design, so tradition can be worn every day. Replace with your brand's
          mission statement.
        </p>
      </div>
    </div>
  );
}
