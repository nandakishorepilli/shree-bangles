import crypto from "crypto";

/**
 * Minimal signed-session implementation for the admin area.
 *
 * Why not NextAuth/Iron-session? For a single admin-only login (no social
 * auth, no multi-provider needs), a small HMAC-signed cookie is easier for
 * another coding agent to read end-to-end in one file than configuring a
 * full auth library. If real customer accounts are added later, replacing
 * this with NextAuth would be a reasonable next step — see PROJECT_CONTEXT.md.
 */

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set. Copy .env.example to .env and set it.");
  }
  return secret;
}

interface SessionPayload {
  adminId: string;
  email: string;
  issuedAt: number;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Builds the cookie value: base64(payload).signature */
export function createSessionToken(payload: Omit<SessionPayload, "issuedAt">): string {
  const fullPayload: SessionPayload = { ...payload, issuedAt: Date.now() };
  const encoded = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

/** Verifies signature + expiry, returns the payload if valid, otherwise null. */
export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expectedSignature = sign(encoded);
  const validSignature =
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!validSignature) return null;

  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8"));
    const ageSeconds = (Date.now() - payload.issuedAt) / 1000;
    if (ageSeconds > SESSION_MAX_AGE_SECONDS) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = {
  name: SESSION_COOKIE_NAME,
  maxAge: SESSION_MAX_AGE_SECONDS
};
