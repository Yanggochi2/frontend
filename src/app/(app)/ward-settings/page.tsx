import AdminPageHeader from "@/components/ui/AdminPageHeader";
import { AdminErrorState } from "@/components/ui/AdminStatus";
import WardSettingsView from "@/components/ward/WardSettingsView";
import { getWardSettings } from "@/services/wardApi";
import { toPreviewState } from "@/types/adminCommon.type";
import type { WardSettingsData } from "@/types/ward.type";

export default async function WardSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const state = toPreviewState((await searchParams).state);
  let ward: WardSettingsData | null = null;
  try {
    ward = await getWardSettings(state);
  } catch {
    ward = null;
  }

  return (
    <div className="flex min-w-0 flex-col gap-8 px-12 pt-12 pb-10">
      <AdminPageHeader title="병동 설정" subtitle="병동 코드와 수간호사 권한을 관리해요" />
      {ward ? <WardSettingsView ward={ward} /> : <AdminErrorState />}
    </div>
  );
}
