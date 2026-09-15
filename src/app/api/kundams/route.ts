import { NextRequest, NextResponse } from "next/server";
import { createKundam, getActiveKundams, getAllKundams } from "@/services/kundamService";
import { kundamInputSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET(request: NextRequest) {
  const all = new URL(request.url).searchParams.get("all") === "true";
  if (all) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;
  }
  return NextResponse.json({ kundams: all ? await getAllKundams() : await getActiveKundams() });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const parsed = kundamInputSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({ kundam: await createKundam(parsed.data) }, { status: 201 });
}
