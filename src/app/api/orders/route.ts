import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders } from "@/services/orderService";
import { checkoutSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/apiAuth";

// GET /api/orders — admin only, powers the Orders dashboard page.
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const orders = await getOrders();
  return NextResponse.json({ orders });
}

// POST /api/orders — public, called from the checkout page.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const order = await createOrder(parsed.data);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    // Most likely cause: stock ran out between "add to cart" and checkout.
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not place order" },
      { status: 409 }
    );
  }
}
