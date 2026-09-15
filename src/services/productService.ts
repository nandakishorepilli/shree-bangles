import { prisma } from "@/lib/prisma";
import { PRODUCT_STATUS } from "@/lib/status";
import slugify from "slugify";
import type { ProductInput } from "@/types";

/**
 * Product service layer.
 *
 * Every read/write to the Product table goes through here — API routes and
 * server components should never call `prisma.product.*` directly. This
 * keeps business rules (e.g. products added through admin are public)
 * in one place instead of scattered across route handlers.
 */

const productWithRelations = {
  images: { orderBy: { position: "asc" as const } },
  variants: true,
  category: true
};

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
}

/** Public catalogue. Legacy HIDDEN products stay hidden; Draft is no longer a customer-facing workflow. */
export async function getProducts(filters: ProductFilters = {}) {
  return prisma.product.findMany({
    where: {
      status: { not: PRODUCT_STATUS.HIDDEN },
      category: filters.categorySlug ? { slug: filters.categorySlug } : undefined,
      isFeatured: filters.featured ? true : undefined,
      isNewArrival: filters.newArrival ? true : undefined,
      isBestseller: filters.bestseller ? true : undefined,
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search } },
              { description: { contains: filters.search } }
            ]
          }
        : {})
    },
    include: productWithRelations,
    orderBy: { createdAt: "desc" }
  });
}

/** Public-facing single product lookup. Legacy HIDDEN products remain unavailable. */
export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: { not: PRODUCT_STATUS.HIDDEN } },
    include: productWithRelations
  });
}

/** Admin-facing lookup by id — returns regardless of status (Draft/Hidden included). */
export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: productWithRelations
  });
}

/** Admin-facing: returns every product regardless of status, for the dashboard table. */
export async function getAllProductsForAdmin() {
  return prisma.product.findMany({
    include: productWithRelations,
    orderBy: { createdAt: "desc" }
  });
}

function buildUniqueSlug(name: string, existingId?: string) {
  // Simple slug generation. On collision, callers should retry with a suffix;
  // kept simple here since collisions are rare for a boutique-scale catalogue.
  return slugify(name, { lower: true, strict: true });
}

export async function createProduct(input: ProductInput) {
  const baseSlug = buildUniqueSlug(input.name);
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${attempt++}`;
  }

  const categoryId = input.categoryId ?? (await getDefaultCategoryId());
  return prisma.product.create({
    data: {
      name: input.name,
      slug,
      description: input.description,
      price: input.price,
      salePrice: input.salePrice ?? null,
      stock: input.stock,
      categoryId,
      // Retained column: new products are public automatically.
      status: PRODUCT_STATUS.PUBLISHED,
      isFeatured: input.isFeatured,
      isNewArrival: input.isNewArrival,
      isBestseller: input.isBestseller,
      images: { create: input.images.map((img, i) => ({ ...img, position: i })) },
      variants: { create: input.variants }
    },
    include: productWithRelations
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  // Replacing images/variants wholesale keeps the update logic simple and
  // predictable for the admin form, which always submits the full product.
  return prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });
    await tx.productVariant.deleteMany({ where: { productId: id } });

    return tx.product.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        salePrice: input.salePrice ?? null,
        stock: input.stock,
        // Keep the current category for edits. The category is now an
        // implementation detail, not a product-management field.
        ...(input.categoryId ? { categoryId: input.categoryId } : {}),
        status: PRODUCT_STATUS.PUBLISHED,
        isFeatured: input.isFeatured,
        isNewArrival: input.isNewArrival,
        isBestseller: input.isBestseller,
        images: { create: input.images.map((img, i) => ({ ...img, position: i })) },
        variants: { create: input.variants }
      },
      include: productWithRelations
    });
  });
}

async function getDefaultCategoryId() {
  const bangles = await prisma.category.findUnique({ where: { slug: "bangles" } });
  if (bangles) return bangles.id;

  const existing = await prisma.category.findFirst({ orderBy: { createdAt: "asc" } });
  if (existing) return existing.id;

  // Only reached for a completely empty, existing database. This satisfies
  // the legacy required relation without asking an admin to manage categories.
  return (await prisma.category.create({ data: { name: "Bangles", slug: "bangles" } })).id;
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

/**
 * Decrements stock for a product (or a specific variant) after purchase.
 * Throws if there isn't enough stock, so callers (e.g. checkout) must handle
 * the error and surface "Out of stock" to the customer rather than
 * over-selling.
 */
export async function decrementStock(productId: string, quantity: number, variantId?: string) {
  if (variantId) {
    const variant = await prisma.productVariant.findUniqueOrThrow({ where: { id: variantId } });
    if (variant.stock < quantity) throw new Error("Insufficient stock for this variant");
    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: variant.stock - quantity }
    });
  }

  const product = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
  if (product.stock < quantity) throw new Error("Insufficient stock for this product");
  return prisma.product.update({
    where: { id: productId },
    data: { stock: product.stock - quantity }
  });
}

/** Direct manual stock update, used by the admin "Change Stock" control. */
export async function updateStock(productId: string, newStock: number) {
  return prisma.product.update({ where: { id: productId }, data: { stock: newStock } });
}
