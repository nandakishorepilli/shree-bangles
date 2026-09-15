/**
 * Public business settings used by the catalogue. Keep the WhatsApp number in
 * one place. It is deliberately a fixed business setting so every deployed
 * storefront sends enquiries to the confirmed Shree Bangles number.
 */
const configuredWhatsappNumber = "916371569938";

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
