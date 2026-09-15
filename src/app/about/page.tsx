import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl py-14">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-600">Our Story</p>
        <h1 className="font-display text-4xl text-blush-900">About Shree Bangles</h1>
      </div>
      <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
        <Image src="/about-shree-bangles.png" alt="Handmade Shree Bangles" fill className="object-cover" />
      </div>
      <div className="space-y-4 leading-relaxed text-blush-800">
        <p>
          <span className="font-medium text-blush-900">Our Story. </span>
          Shree Bangles brings the beauty of handmade Indian bangles to customers through carefully
          crafted traditional and contemporary designs. Each piece is created with attention to detail
          and a love for the art of bangle making.
        </p>
        <p>
          <span className="font-medium text-blush-900">Our Craft. </span>
          Our bangles are carefully assembled and finished by hand. From selecting decorative elements
          to placing each Kundan and finishing the design, every step is handled with patience and
          attention to detail.
        </p>
        <p>
          <span className="font-medium text-blush-900">Our Mission. </span>
          Our mission is to make traditional bangle craftsmanship feel personal and accessible. With
          ready-made designs and customized options, Shree Bangles creates pieces that customers can
          choose to match their style, occasion, and preferences.
        </p>
      </div>
    </div>
  );
}
