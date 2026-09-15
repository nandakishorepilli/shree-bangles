import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct, updateStock } from "@/services/productService";
import { productInputSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/apiAuth";

interface Params {
  params: { id: string };
}

// GET /api/products/:id — used by the admin edit form (works for any status).
export async function GET(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const product = await getProductById(params.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

// PATCH /api/products/:id — full update, or a lightweight { stock } update.
export async function PATCH(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json();

  // Lightweight path used by the "Change Stock" quick-edit control.
  if (Object.keys(body).length === 1 && typeof body.stock === "number") {
    const product = await updateStock(params.id, body.stock);
    return NextResponse.json({ product });
  }

  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await updateProduct(params.id, parsed.data);
  return NextResponse.json({ product });
}

// DELETE /api/products/:id
export async function DELETE(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  await deleteProduct(params.id);
  return NextResponse.json({ success: true });
}
