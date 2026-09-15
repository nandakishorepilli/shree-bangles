import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate min-h-[430px] overflow-hidden rounded-3xl bg-blush-100 sm:min-h-[470px] lg:min-h-[500px]">
      <div className="relative flex min-h-[430px] items-center px-6 py-12 sm:min-h-[470px] sm:px-12 lg:min-h-[500px] lg:px-16">
        <div className="relative z-10 max-w-md">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gold-600">Handmade &middot; Heritage &middot; Elegance</p>
          <h1 className="font-display text-4xl leading-tight text-blush-900 sm:text-5xl">
            Bangles that carry the story of tradition, made for today.
          </h1>
          <p className="mt-4 max-w-md text-blush-800">
            Discover bangles that bring a graceful finishing touch to everyday moments and
            celebrations alike.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-blush-600 px-8 py-3 font-medium text-cream-50 transition-colors hover:bg-blush-700"
          >
            Explore the Collection
          </Link>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/hero-bangles-woman.png"
            alt="Woman wearing handmade bangles"
            fill
            className="object-cover object-[75%_center] lg:object-center"
            priority
          />
        </div>
      </div>
    </section>
  );
}
