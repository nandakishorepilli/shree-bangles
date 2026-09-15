/**
 * Seeds the database with:
 *  - one admin account (from ADMIN_EMAIL / ADMIN_PASSWORD in .env)
 *  - a starter set of categories
 *  - a handful of placeholder products, so the storefront isn't empty
 *    on first run. All of this is safe to delete/replace once real
 *    product data is available — nothing here is hardcoded into the UI.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  throw new Error(
    "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before running the seed."
  );
}
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  const legacyAdmin = await prisma.admin.findUnique({ where: { email: "owner@example.com" } });

  if (existingAdmin) {
    await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: { passwordHash }
    });
    if (legacyAdmin && legacyAdmin.id !== existingAdmin.id) {
      await prisma.admin.delete({ where: { id: legacyAdmin.id } });
    }
  } else if (legacyAdmin) {
    await prisma.admin.update({
      where: { id: legacyAdmin.id },
      data: { email: adminEmail, passwordHash }
    });
  } else {
    await prisma.admin.create({
      data: { email: adminEmail, passwordHash, name: "Boutique Owner" }
    });
  }
  console.log(`Admin account ready: ${adminEmail}`);

  const categories = [
    { name: "Traditional", slug: "traditional", description: "Timeless handcrafted bangles rooted in Indian heritage." },
    { name: "Bridal", slug: "bridal", description: "Statement bangles for weddings and special occasions." },
    { name: "Everyday", slug: "everyday", description: "Lightweight bangles for daily wear." },
    { name: "Customized", slug: "customized", description: "Made-to-order bangles, personalized for you." }
  ];

  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  console.log(`Seeded ${categories.length} categories.`);

  const traditional = await prisma.category.findUniqueOrThrow({ where: { slug: "traditional" } });
  const bridal = await prisma.category.findUniqueOrThrow({ where: { slug: "bridal" } });
  const everyday = await prisma.category.findUniqueOrThrow({ where: { slug: "everyday" } });

  const placeholderProducts = [
    {
      name: "Pink Pearl Bangles",
      slug: "pink-pearl-bangles",
      description: "Placeholder description — hand-strung pearl-accented bangles. Replace with real product copy.",
      price: 499,
      salePrice: null,
      stock: 10,
      categoryId: traditional.id,
      status: "PUBLISHED",
      isFeatured: true,
      isNewArrival: true,
      isBestseller: false,
      images: [{ url: "/placeholders/bangle-1.svg", altText: "Pink Pearl Bangles", position: 0 }]
    },
    {
      name: "Rose Gold Kada Set",
      slug: "rose-gold-kada-set",
      description: "Placeholder description — a set of three rose gold-toned kadas.",
      price: 899,
      salePrice: 749,
      stock: 6,
      categoryId: bridal.id,
      status: "PUBLISHED",
      isFeatured: true,
      isNewArrival: false,
      isBestseller: true,
      images: [{ url: "/placeholders/bangle-2.svg", altText: "Rose Gold Kada Set", position: 0 }]
    },
    {
      name: "Meenakari Everyday Bangles",
      slug: "meenakari-everyday-bangles",
      description: "Placeholder description — lightweight enamel-work bangles for daily wear.",
      price: 349,
      salePrice: null,
      stock: 0,
      categoryId: everyday.id,
      status: "PUBLISHED",
      isFeatured: false,
      isNewArrival: true,
      isBestseller: false,
      images: [{ url: "/placeholders/bangle-3.svg", altText: "Meenakari Everyday Bangles", position: 0 }]
    },
    {
      name: "Draft Sample Bangle (not visible publicly)",
      slug: "draft-sample-bangle",
      description: "This product is a Draft and should never appear on the storefront — used to verify status filtering.",
      price: 599,
      salePrice: null,
      stock: 3,
      categoryId: traditional.id,
      status: "DRAFT",
      isFeatured: false,
      isNewArrival: false,
      isBestseller: false,
      images: []
    }
  ];

  for (const p of placeholderProducts) {
    const { images, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...rest, images: { create: images } }
    });
  }
  console.log(`Seeded ${placeholderProducts.length} placeholder products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
