import type { Product, ProductImage, ProductVariant, Category } from "@prisma/client";
import type { ProductStatus, OrderStatus } from "@/lib/status";

/** A product as returned by the service layer, with its relations attached. */
export type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category;
};

export type { ProductStatus, OrderStatus, Category };

/** Shape accepted by createProduct / updateProduct. */
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  categoryId?: string;
  status?: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  images: { url: string; altText?: string }[];
  variants: { color?: string; size?: string; stock: number }[];
}

/** A single line in the client-side cart (stored in localStorage). */
export interface CartLine {
  productId?: string;
  variantId?: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  color?: string;
  size?: string;
  quantity: number;
  maxStock: number;
  customization?: {
    kundams: { id: string; name: string; image: string }[];
    color: string;
    shade: "Light" | "Normal" | "Dark";
  };
}
