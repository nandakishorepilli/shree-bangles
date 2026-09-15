import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/services/productService";
import { productInputSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/apiAuth";

// GET /api/products?category=traditional&search=pearl&featured=true
// Public endpoint — always filtered to PUBLISHED products by the service layer.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const products = await getProducts({
    categorySlug: searchParams.get("category") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    featured: searchParams.get("featured") === "true",
    newArrival: searchParams.get("newArrival") === "true",
    bestseller: searchParams.get("bestseller") === "true"
  });
  return NextResponse.json({
    products: products.map((product) => ({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestseller: product.isBestseller,
      inStock: product.stock > 0 || product.variants.some((variant) => variant.stock > 0),
      images: product.images.map((image) => ({ url: image.url, altText: image.altText }))
    }))
  });
}

// POST /api/products — admin only. This is how new products become visible
// on the storefront without touching any frontend code: the admin dashboard
// calls this route, and every customer-facing page reads from the database.
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await createProduct(parsed.data);
  return NextResponse.json({ product }, { status: 201 });
}
