import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/apiAuth";
import { instagramPostsSchema } from "@/lib/validations";
import { saveInstagramPosts } from "@/services/instagramPostService";

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const parsed = instagramPostsSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const settings = await saveInstagramPosts(parsed.data);
  revalidatePath("/");
  return NextResponse.json({ settings });
}
