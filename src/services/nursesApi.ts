import { nurseActiveCountMock, nurseItemsMock } from "@/mocks/nurses.mock";
import type { PreviewState } from "@/types/requests.type";
import type { NurseListResult } from "@/types/nurses.type";

// TODO: 백엔드 확정 후 실제 요청으로 교체 (주소는 환경 변수로 분리)
// state는 화면 상태 미리보기용(개발 확인용). 백엔드 연결 시 제거한다.
export async function getNurses(state?: PreviewState): Promise<NurseListResult> {
  if (state === "error") throw new Error("간호사 명단을 불러오지 못했어요");
  if (state === "empty") return { items: [], activeCount: 0 };
  return { items: nurseItemsMock, activeCount: nurseActiveCountMock };
}
