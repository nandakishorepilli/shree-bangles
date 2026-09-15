"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" }
];

export function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-blush-100 bg-white p-6">
      <p className="mb-8 font-display text-lg text-blush-900">Shree Bangles</p>
      <nav className="flex-1 space-y-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm",
              pathname === link.href ? "bg-blush-100 text-blush-800 font-medium" : "text-blush-600 hover:bg-blush-50"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-blush-100 pt-4">
        <p className="mb-2 truncate text-xs text-blush-400">{adminEmail}</p>
        <button onClick={handleLogout} className="text-sm text-blush-600 hover:text-blush-800">
          Log out
        </button>
      </div>
    </aside>
  );
}
