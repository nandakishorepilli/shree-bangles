import { prisma } from "@/lib/prisma";
import slugify from "slugify";

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function createCategory(name: string, description?: string) {
  const slug = slugify(name, { lower: true, strict: true });
  return prisma.category.create({ data: { name, slug, description } });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
