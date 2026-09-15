import { z } from "zod";

export const productVariantSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  stock: z.number().int().min(0)
});

export const productImageSchema = z.object({
  url: z.string().min(1, "Image URL is required"),
  altText: z.string().optional()
});

export const productInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than 0"),
  salePrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
  // category/status remain in the database for backwards compatibility, but
  // are assigned by the service rather than being admin form requirements.
  categoryId: z.string().min(1).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).optional(),
  isFeatured: z.boolean(),
  isNewArrival: z.boolean(),
  isBestseller: z.boolean(),
  images: z.array(productImageSchema).default([]),
  variants: z.array(productVariantSchema).default([])
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required")
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  items: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
        color: z.string().optional(),
        size: z.string().optional()
      })
    )
    .min(1, "Cart is empty")
});
