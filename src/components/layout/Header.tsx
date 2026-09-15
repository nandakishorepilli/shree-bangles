"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FabricBagIcon } from "@/components/cart/FabricBagIcon";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/customized", label: "Customized" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

// Note: intentionally no "Admin" link here — the brief asks for the admin
// area to stay unlisted in public navigation. Reach it directly at /admin.
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, isBagAnimating } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-blush-100 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" aria-label="Shree Bangles home">
          <Image
            src="/shree-bangles-logo.png"
            alt="Shree Bangles"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            priority
          />
        </Link>

        <nav className="hidden gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm tracking-wide text-blush-800 transition-colors hover:text-gold-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" aria-label={`Shopping bag with ${itemCount} item${itemCount === 1 ? "" : "s"}`} className="relative text-blush-800 hover:text-blush-700">
            <FabricBagIcon animate={isBagAnimating} className="h-8 w-8" />
            {itemCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blush-600 px-1 text-[10px] font-semibold text-white">{itemCount}</span>}
          </Link>
          <button
            className="text-blush-800 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-3 border-t border-blush-100 px-4 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-blush-800" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
