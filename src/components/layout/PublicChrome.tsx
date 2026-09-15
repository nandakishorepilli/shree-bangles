"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Public storefront chrome must not wrap private admin routes. The root layout
 * still supplies shared providers, while the admin dashboard supplies its own
 * sidebar layout and /admin/login renders only its sign-in form.
 */
export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6">{children}</main>
      <Footer />
    </>
  );
}
