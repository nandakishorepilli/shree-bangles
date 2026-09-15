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

export const kundamInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().min(1, "An image is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0)
});

export const instagramPostsSchema = z.object({
  post1: z.string().url("Post 1 must be a valid URL"),
  post2: z.string().url("Post 2 must be a valid URL"),
  post3: z.string().url("Post 3 must be a valid URL"),
  post4: z.string().url("Post 4 must be a valid URL"),
  post5: z.string().url("Post 5 must be a valid URL")
});
