import Link from "next/link";
import Image from "next/image";

export function CustomizedBangles() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-blush-900 px-6 py-14 text-cream-50 sm:px-12">
      <div className="bg-paisley-faint absolute inset-0 opacity-20" />
      <div className="relative grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gold-400">Made For You</p>
          <h2 className="font-display text-3xl">Customized Bangles</h2>
          <p className="mt-4 max-w-md text-blush-100">
            Placeholder copy: share your size, colors, and occasion, and our artisans will craft a
            one-of-a-kind set just for you.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full border border-gold-400 px-8 py-3 font-medium text-gold-300 transition-colors hover:bg-gold-400 hover:text-blush-900"
          >
            Request a Custom Order
          </Link>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image src="/placeholders/customized-bangles.svg" alt="Customized bangles (placeholder)" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
