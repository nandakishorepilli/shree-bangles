import { KundamManager } from "@/components/admin/KundamManager";
import { getAllKundams } from "@/services/kundamService";

export default async function KundamsPage() {
  const kundams = await getAllKundams();
  return <div><h1 className="mb-6 font-display text-3xl text-blush-900">Kundan Designs</h1><KundamManager initialKundams={kundams} /></div>;
}
