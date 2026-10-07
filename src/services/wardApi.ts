import { wardSettingsMock } from "@/mocks/ward.mock";
import type { PreviewState } from "@/types/adminCommon.type";
import type { WardSettingsData } from "@/types/ward.type";

// TODO: 백엔드 확정 후 실제 요청으로 교체 (주소는 환경 변수로 분리)
export async function getWardSettings(state?: PreviewState): Promise<WardSettingsData> {
  if (state === "error") throw new Error("ward settings load failed");
  return wardSettingsMock;
}
