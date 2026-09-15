import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-blush-100 bg-blush-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="gold-divider mb-8" />
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 font-display text-xl text-blush-700">Shree Bangles</h3>
            <p className="text-sm text-blush-800">
              Handmade bangles crafted with love, celebrating Indian tradition with a modern touch.
              {/* Placeholder brand copy — replace with real "about" content later. */}
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blush-700">Shop</h4>
            <ul className="space-y-2 text-sm text-blush-800">
              <li><Link href="/shop">All Bangles</Link></li>
              <li><Link href="/shop?filter=newArrival">New Arrivals</Link></li>
              <li><Link href="/shop?filter=bestseller">Best Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blush-700">Connect</h4>
            <ul className="space-y-2 text-sm text-blush-800">
              <li><Link href="/contact">Contact Us</Link></li>
              {/* Placeholder — replace with real Instagram handle later. */}
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram (placeholder)</a></li>
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
