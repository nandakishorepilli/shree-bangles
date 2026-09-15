import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "./session";

/**
 * Guard for admin-only API routes.
 * Returns a 401 NextResponse if the request isn't authenticated, or
 * `null` if it's fine to proceed — callers should `return` the result
 * immediately when non-null:
 *
 *   const unauthorized = await requireAdmin(request);
 *   if (unauthorized) return unauthorized;
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(SESSION_COOKIE.name)?.value;
  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
