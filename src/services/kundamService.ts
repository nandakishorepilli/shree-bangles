import { prisma } from "@/lib/prisma";
import type { z } from "zod";
import type { kundamInputSchema } from "@/lib/validations";

type KundamInput = z.infer<typeof kundamInputSchema>;

export function getActiveKundams() {
  return prisma.kundamDesign.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
}

export function getAllKundams() {
  return prisma.kundamDesign.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
}

export function createKundam(input: KundamInput) {
  return prisma.kundamDesign.create({ data: input });
}

export function updateKundam(id: string, input: KundamInput) {
  return prisma.kundamDesign.update({ where: { id }, data: input });
}

export function deleteKundam(id: string) {
  return prisma.kundamDesign.delete({ where: { id } });
}
