"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  onAdd: () => void;
  disabled?: boolean;
  label?: string;
}

/**
 * Replaces a generic "Add to Cart" button with a circular, bangle-inspired
 * control: a ring that spins briefly and shows a checkmark "clasped" state
 * on click, before settling back to the resting bangle icon.
 */
export function BangleAddToCartButton({ onAdd, disabled, label = "Add to Cart" }: Props) {
  const [state, setState] = useState<"idle" | "spinning" | "confirmed">("idle");

  function handleClick() {
    if (disabled || state !== "idle") return;
    onAdd();
    setState("spinning");
    setTimeout(() => setState("confirmed"), 600);
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "group flex items-center gap-3 rounded-full border-2 border-gold-500 bg-blush-500 px-6 py-3 text-cream-50 transition-colors",
        "hover:bg-blush-600 disabled:cursor-not-allowed disabled:border-blush-200 disabled:bg-blush-200 disabled:text-blush-400"
      )}
    >
      <svg
        viewBox="0 0 32 32"
        className={cn("h-6 w-6 shrink-0", state === "spinning" && "animate-bangle-spin")}
        xmlns="http://www.w3.org/2000/svg"
      >
        {state === "confirmed" ? (
          <>
            <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M11 16 L14.5 19.5 L21.5 12.5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          // Two overlapping bangles, echoing the brand's product itself.
          <>
            <circle cx="13" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <circle cx="19" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.6" />
          </>
        )}
      </svg>
      <span className="font-medium tracking-wide">
        {disabled ? "Out of Stock" : state === "confirmed" ? "Added!" : label}
      </span>
    </button>
  );
}
