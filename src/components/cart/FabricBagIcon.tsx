"use client";

import { cn } from "@/lib/utils";

/**
 * Replaces the generic shopping-trolley icon with an illustrated Indian
 * cloth/jewellery pouch, per the brand brief. `animate` triggers a brief
 * wiggle (see the `bag-wiggle` keyframe in tailwind.config.ts) whenever an
 * item is added to the cart.
 */
export function FabricBagIcon({ animate, className }: { animate?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-8 w-8 origin-top", animate && "animate-bag-wiggle", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Drawstring cords */}
      <path d="M16 14 C16 8, 20 6, 24 6 C28 6, 32 8, 32 14" stroke="#c69a42" strokeWidth="1.6" fill="none" />
      {/* Pouch body */}
      <path
        d="M12 16 C12 14, 14 13, 16 13 H32 C34 13, 36 14, 36 16 L38 38 C38 41, 35.5 43 32.5 43 H15.5 C12.5 43 10 41 10 38 Z"
        fill="#f6cdd6"
        stroke="#a12a4b"
        strokeWidth="1.2"
      />
      {/* Textile fold lines */}
      <path d="M14 20 L34 20" stroke="#e57d97" strokeWidth="1" opacity="0.6" />
      <path d="M13 27 L35 27" stroke="#e57d97" strokeWidth="1" opacity="0.5" />
      {/* Small bangle charm detail */}
      <circle cx="24" cy="30" r="4.2" fill="none" stroke="#c69a42" strokeWidth="1.8" />
      {/* Rangoli-style dot trim near the top */}
      <circle cx="17" cy="16" r="0.8" fill="#a12a4b" />
      <circle cx="24" cy="16" r="0.8" fill="#a12a4b" />
      <circle cx="31" cy="16" r="0.8" fill="#a12a4b" />
    </svg>
  );
}
