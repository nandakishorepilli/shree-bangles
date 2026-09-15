import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/** Verifies admin credentials. Returns the admin record on success, null otherwise. */
export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;

  const valid = await bcrypt.compare(password, admin.passwordHash);
  return valid ? admin : null;
}
