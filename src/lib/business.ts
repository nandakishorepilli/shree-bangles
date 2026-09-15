/**
 * Public business settings used by the catalogue. Keep the WhatsApp number in
 * one place. It is deliberately a fixed business setting so every deployed
 * storefront sends enquiries to the confirmed Shree Bangles number.
 */
const configuredWhatsappNumber = "916371569938";

export const shreeBanglesWhatsappNumber = configuredWhatsappNumber.replace(/\D/g, "");

export function getWhatsappOrderUrl(message: string) {
  if (!shreeBanglesWhatsappNumber) return null;
  return `https://wa.me/${shreeBanglesWhatsappNumber}?text=${encodeURIComponent(message)}`;
}
