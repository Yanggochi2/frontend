import {
  generationFailureMock,
  generationProgressMock,
  monthSheetMock,
  unassignedSheetMock,
  weekSheetMock,
} from "@/mocks/schedule.mock";
import type {
  GenerationFailure,
  GenerationProgress,
  SchedulePageData,
  SchedulePageParams,
} from "@/types/schedule.type";

// TODO: 백엔드 확정 후 실제 요청으로 교체 (주소는 환경 변수로 분리)
// params(state / role / view)는 화면 미리보기용 임시 값이다. 역할은 서버가 세션에서 판정한다 (AGENTS.md 6.1).
export async function getSchedulePage(params: SchedulePageParams = {}): Promise<SchedulePageData> {
  const periodLabel = "2026년 10월";

  if (params.state === "error") throw new Error("schedule mock error");
  // TODO: mock 미리보기 전용. 일반 간호사 분기는 서버 판정으로 교체
  if (params.role === "nurse") return { kind: "nurse-unpublished", periodLabel };
  if (params.state === "empty") return { kind: "no-nurses", periodLabel };
  if (params.state === "unassigned") return { kind: "sheet", sheet: unassignedSheetMock() };
  if (params.view === "month") return { kind: "sheet", sheet: monthSheetMock() };
  return { kind: "sheet", sheet: weekSheetMock() };
}

export async function getGenerationProgress(state?: string): Promise<GenerationProgress> {
  if (state === "error") throw new Error("generation mock error");
  return generationProgressMock;
}

export async function getGenerationFailure(state?: string): Promise<GenerationFailure> {
  if (state === "error") throw new Error("generation failure mock error");
  return generationFailureMock;
}
