import type { StatsData } from "@/types/stats.type";

// TODO: 통계 API 명세 없음 — 백엔드에 확인 (Schedule.statistics[] 모양도 미정).
// 명세가 생기기 전까지는 빈 결과를 돌려주어 화면이 빈 상태를 보여 준다.
export async function getStats(): Promise<StatsData> {
  return { periodLabel: "", rows: [] };
}
