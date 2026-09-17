/**
 * Public business settings used by the catalogue. Keep the WhatsApp number in
 * one place. It is deliberately a fixed business setting so every deployed
 * storefront sends enquiries to the confirmed Shree Bangles number.
 */
const configuredWhatsappNumber = "916371569938";
const configuredStorefrontUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const shreeBanglesWhatsappNumber = configuredWhatsappNumber.replace(/\D/g, "");
export const shreeBanglesContact = {
  email: "padhmashreekala@gmail.com",
  phone: "+91 63715 69938",
  address: "Saranda, Attabira, Bargarh, Odisha, PIN: 768027",
  instagramUrl: "https://www.instagram.com/shree___bangles/"
} as const;

export function getWhatsappOrderUrl(message: string) {
  if (!shreeBanglesWhatsappNumber) return null;
  return `https://wa.me/${shreeBanglesWhatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Returns the public URL for a product. In the browser, the active storefront
 * origin is used so links always point to the deployed site. NEXT_PUBLIC_SITE_URL
 * provides the same absolute URL when this is needed outside the browser.
 */
export function getProductUrl(slug: string) {
  const productPath = `/product/${encodeURIComponent(slug)}`;
  const storefrontUrl = typeof window !== "undefined" ? window.location.origin : configuredStorefrontUrl;

  return storefrontUrl ? new URL(productPath, storefrontUrl).toString() : productPath;
}
