import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { PublicChrome } from "@/components/layout/PublicChrome";

export const metadata: Metadata = {
  title: "Shree Bangles | Handmade Indian Bangles",
  description: "A premium, handmade Indian bangle boutique. Traditional craftsmanship, modern elegance."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <PublicChrome>{children}</PublicChrome>
        </CartProvider>
      </body>
    </html>
  );
}
