import { requestFormOptionsMock, requestItemsMock } from "@/mocks/requests.mock";
import type {
  PreviewState,
  RequestFormOptions,
  RequestListResult,
} from "@/types/requests.type";

// TODO: 백엔드 확정 후 실제 요청으로 교체 (주소는 환경 변수로 분리)
// state는 화면 상태 미리보기용(개발 확인용). 백엔드 연결 시 제거한다.
export async function getRequests(state?: PreviewState): Promise<RequestListResult> {
  if (state === "error") throw new Error("신청 목록을 불러오지 못했어요");
  const items = state === "empty" ? [] : requestItemsMock;
  return {
    items,
    pendingCount: items.filter((i) => i.status === "PENDING").length,
    monthLabel: "2026년 10월",
  };
}

export async function getRequestFormOptions(): Promise<RequestFormOptions> {
  return requestFormOptionsMock;
}
