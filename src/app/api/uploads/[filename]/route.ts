import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { getUploadContentType, getUploadPath } from "@/lib/uploadStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public, stable URLs for product images stored on the persistent volume. */
export async function GET(_request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filePath = getUploadPath(params.filename);
    const contentType = getUploadContentType(params.filename);
    if (!filePath || !contentType) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const image = await readFile(filePath);
    return new NextResponse(image, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    console.error("Image read failed", error);
    return NextResponse.json({ error: "Image is temporarily unavailable" }, { status: 500 });
  }
}
