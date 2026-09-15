import { NextRequest, NextResponse } from "next/server";
import { deleteKundam, updateKundam } from "@/services/kundamService";
import { kundamInputSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/apiAuth";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const parsed = kundamInputSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({ kundam: await updateKundam(params.id, parsed.data) });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  await deleteKundam(params.id);
  return NextResponse.json({ success: true });
}
