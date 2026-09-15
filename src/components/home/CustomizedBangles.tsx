import Image from "next/image";
import Link from "next/link";

export function CustomizedBangles() {
  return (
    <section className="relative isolate min-h-[430px] overflow-hidden rounded-3xl bg-blush-900 sm:min-h-[470px] lg:min-h-[500px]">
      <Image
        src="/customized-bangles-banner.png"
        alt=""
        fill
        priority={false}
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 1200px"
        className="object-cover object-[70%_center] sm:object-[66%_center] lg:object-center"
      />
      <div className="relative z-10 flex min-h-[430px] items-center px-6 py-12 text-cream-50 sm:min-h-[470px] sm:px-12 lg:min-h-[500px] lg:px-16">
        <div className="max-w-md">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gold-300">MADE FOR YOU</p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">Customized Bangles</h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-cream-100 sm:text-lg">
            Share your size, colors, and occasion, and our artisans will craft a one-of-a-kind set
            just for you.
          </p>
          <Link
            href="/customized"
            className="mt-8 inline-block rounded-full bg-gold-400 px-8 py-3 font-medium text-blush-900 transition-colors hover:bg-gold-300"
          >
            Create Your Custom Bangle
          </Link>
        </div>
      </div>
    </section>
  );
}
