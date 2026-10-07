import { statsMock } from "@/mocks/stats.mock";
import type { PreviewState } from "@/types/adminCommon.type";
import type { StatsData } from "@/types/stats.type";

// TODO: 통계 API 명세 없음 — 백엔드에 확인 (Schedule.statistics[] 모양도 미정). 그때까지 mock 유지.
// TODO: 백엔드 확정 후 실제 요청으로 교체. 수간호사는 전원, 일반 간호사는 본인만(서버가 판정)
export async function getStats(state?: PreviewState): Promise<StatsData> {
  if (state === "error") throw new Error("stats load failed");
  if (state === "empty") return { ...statsMock, rows: [] };
  return statsMock;
}
