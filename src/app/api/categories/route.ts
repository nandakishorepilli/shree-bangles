import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory } from "@/services/categoryService";
import { requireAdmin } from "@/lib/apiAuth";

// GET /api/categories — public, used to populate shop navigation/filtering.
export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

// POST /api/categories — admin only.
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { name, description } = await request.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }

  const category = await createCategory(name, description);
  return NextResponse.json({ category }, { status: 201 });
}
