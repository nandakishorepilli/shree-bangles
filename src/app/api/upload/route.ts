import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { mkdir, stat, writeFile } from "fs/promises";
import crypto from "crypto";
import { getUploadsDirectory } from "@/lib/uploadStorage";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getImageExtension(buffer: Buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return ".jpg";
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 && buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a) return ".png";
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return ".webp";
  return null;
}

function safeStorageError(error: unknown, requestId: string) {
  const code = (error as NodeJS.ErrnoException | undefined)?.code;
  if (code === "EACCES" || code === "EPERM") return `The server cannot write to the configured upload storage (permission denied). Reference: ${requestId}`;
  if (code === "EROFS") return `The configured upload storage is read-only. Reference: ${requestId}`;
  if (code === "ENOSPC") return `The configured upload storage is full. Reference: ${requestId}`;
  if (code === "ENOENT") return `The configured upload storage path is unavailable. Reference: ${requestId}`;
  return `The server could not store the image. Check Railway logs with reference: ${requestId}`;
}

// POST /api/upload accepts multipart/form-data with a single "file" field.
// In production UPLOADS_DIR must point inside a mounted Railway Volume.
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const requestId = crypto.randomUUID();
  let stage = "parse multipart form data";

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      console.warn("Image upload rejected", { requestId, stage, hasFileField: Boolean(file) });
      return NextResponse.json({ error: "No image file was received. Choose a JPEG, PNG, or WebP image and try again." }, { status: 400 });
    }

    console.info("Image upload received", {
      requestId,
      configuredUploadsDir: process.env.UPLOADS_DIR ?? null,
      fileSize: file.size,
      mimeType: file.type || "unknown"
    });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Image must be 5 MB or smaller" }, { status: 400 });

    stage = "read image bytes";
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = getImageExtension(buffer);
    if (!extension) return NextResponse.json({ error: "Only JPEG, PNG, and WebP images are supported" }, { status: 400 });

    stage = "resolve upload directory";
    const uploadsDir = getUploadsDirectory();
    console.info("Image upload storage resolved", { requestId, uploadsDir, byteLength: buffer.length, extension });

    stage = "create upload directory";
    await mkdir(uploadsDir, { recursive: true });
    if (!(await stat(uploadsDir)).isDirectory()) throw new Error("Configured upload path is not a directory");
    console.info("Image upload directory ready", { requestId, uploadsDir });

    const filename = `${crypto.randomUUID()}${extension}`;
    const imagePath = `${uploadsDir}/${filename}`;
    stage = "write image file";
    await writeFile(imagePath, buffer, { flag: "wx" });

    const url = `/api/uploads/${filename}`;
    console.info("Image upload stored", { requestId, filename, imagePath, byteLength: buffer.length, url });
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    console.error("Image upload failed", {
      requestId,
      stage,
      configuredUploadsDir: process.env.UPLOADS_DIR ?? null,
      errorCode: nodeError?.code ?? null,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json({ error: safeStorageError(error, requestId) }, { status: 500 });
  }
}
