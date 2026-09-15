import Link from "next/link";
import Image from "next/image";
import { shreeBanglesContact } from "@/lib/business";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-blush-100 bg-blush-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="gold-divider mb-8" />
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <Image
              src="/shree-bangles-logo.png"
              alt="Shree Bangles"
              width={48}
              height={48}
              className="mb-3 h-12 w-12 rounded-full object-cover"
              unoptimized
            />
            <p className="text-sm text-blush-800">
              Handmade bangles crafted with love, celebrating Indian tradition with a modern touch.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blush-700">Shop</h4>
            <ul className="space-y-2 text-sm text-blush-800">
              <li><Link href="/shop">All Bangles</Link></li>
              <li><Link href="/shop?filter=newArrival">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blush-700">Connect</h4>
            <ul className="space-y-2 text-sm text-blush-800">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><a href={`mailto:${shreeBanglesContact.email}`}>{shreeBanglesContact.email}</a></li>
              <li><a href={`tel:${shreeBanglesContact.phone.replace(/\s/g, "")}`}>{shreeBanglesContact.phone}</a></li>
              <li>{shreeBanglesContact.address}</li>
              <li><a href={shreeBanglesContact.instagramUrl} target="_blank" rel="noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-blush-400">
          © {new Date().getFullYear()} Shree Bangles. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
