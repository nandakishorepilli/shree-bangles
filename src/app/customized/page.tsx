import { CustomBangleDesigner } from "@/components/home/CustomBangleDesigner";
import { getActiveKundams } from "@/services/kundamService";

export const dynamic = "force-dynamic";

export default async function CustomizedPage() {
  const kundams = await getActiveKundams();

  return (
    <div className="py-10">
      <CustomBangleDesigner kundams={kundams} />
    </div>
  );
}
