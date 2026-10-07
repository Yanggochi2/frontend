import { apiRequest } from "@/lib/apiClient";
import type { GenerationFailure, GenerationProgress } from "@/types/schedule.type";
import type {
  ApiGenerationJob,
  ApiGenerationPartialApply,
  ApiGenerationRelaxations,
  ApiGenerationStart,
  ApiGenerationStop,
  ApiSchedule,
  ApiScheduleWithViolations,
} from "@/types/scheduleApi.type";
import { getScheduleById } from "./scheduleApi";

const GENERATIONS = "/wards/me/generations";

// GEN-01. 중복 시작을 막으려고 호출부가 만든 Idempotency-Key를 넘긴다.
// 409 GENERATION_ALREADY_RUNNING, 422 PRECONDITION_FAILED는 ApiError로 던진다.
export function startGeneration(scheduleId: string, body: ApiGenerationStart, idempotencyKey: string) {
  return apiRequest<ApiGenerationJob>(`/wards/me/schedules/${scheduleId}/generations`, {
    method: "POST",
    body,
    idempotencyKey,
  });
}

// GEN-02
export function getGenerationJob(jobId: string) {
  return apiRequest<ApiGenerationJob>(`${GENERATIONS}/${jobId}`);
}

// GEN-03. applyBestResult에 따라 GenerationJob 또는 Schedule이 온다 (명세에 구분 필드 없음).
export function stopGeneration(jobId: string, body: ApiGenerationStop) {
  // TODO: 응답이 Job인지 Schedule인지 구분하는 방법은 백엔드 확정 후 결정
  return apiRequest<ApiGenerationJob | ApiSchedule>(`${GENERATIONS}/${jobId}/stop`, { method: "POST", body });
}

// GEN-04. 완화 선택 후 새 작업이 시작된다.
export function startRelaxedGeneration(jobId: string, body: ApiGenerationRelaxations, idempotencyKey: string) {
  return apiRequest<ApiGenerationJob>(`${GENERATIONS}/${jobId}/relaxations`, {
    method: "POST",
    body,
    idempotencyKey,
  });
}

// GEN-05
export function applyPartialResult(jobId: string, body: ApiGenerationPartialApply) {
  return apiRequest<ApiScheduleWithViolations>(`${GENERATIONS}/${jobId}/partial-result/apply`, { method: "POST", body });
}

// ---- 화면용 ----

function mmss(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// jobId는 진행 화면이 어느 작업인지 알려 준다.
// TODO: jobId를 화면 간에 어떻게 넘길지(쿼리/상태)는 라우팅 확정 후 결정. 지금은 ?jobId= 쿼리.
export async function getGenerationProgress(jobId?: string): Promise<GenerationProgress> {
  if (!jobId) throw new Error("jobId가 필요해요.");
  const job = await getGenerationJob(jobId);
  const schedule = await getScheduleById(job.scheduleId);
  const [y, m] = schedule.yearMonth.split("-");
  return {
    periodLabel: `${y}년 ${Number(m)}월`,
    // TODO: stage 모양이 명세에 없어 단계 목록을 만들 수 없다. 현재 단계 하나만 보여 준다.
    steps: [{ order: 1, title: typeof job.stage === "string" ? job.stage : "생성 중", status: "active" }],
    // TODO: metrics 모양이 명세에 없다. 명세에 있는 경과 시간·하드 위반 수만 쓴다. (희망 오프 반영률은 필드 없음)
    metrics: [
      { label: "경과 시간", value: mmss(job.elapsedSeconds), tone: "default" },
      { label: "남은 하드 위반", value: `${job.hardViolationCount}건`, tone: job.hardViolationCount > 0 ? "danger" : "default" },
    ],
  };
}

export async function getGenerationFailure(jobId?: string): Promise<GenerationFailure> {
  if (!jobId) throw new Error("jobId가 필요해요.");
  const job = await getGenerationJob(jobId);
  // TODO: conflicts / relaxations 모양이 명세에 없다. 완화 선택지와 원인 문구는 확정 후 매핑한다.
  return {
    title: "조건을 모두 맞추는 근무표를 찾지 못했어요",
    subtitle: `남은 하드 위반 ${job.hardViolationCount}건`,
    cause: { tag: "충돌 원인", headline: "", detail: "" },
    options: [],
  };
}

// 서버에 연결하지 못했을 때 화면 틀만 보여 주기 위한 빈 값
export function getEmptyGenerationProgress(): GenerationProgress {
  const now = new Date();
  return {
    periodLabel: `${now.getFullYear()}년 ${now.getMonth() + 1}월`,
    steps: [],
    metrics: [
      { label: "경과 시간", value: "-", tone: "default" },
      { label: "남은 하드 위반", value: "-", tone: "default" },
    ],
  };
}

export function getEmptyGenerationFailure(): GenerationFailure {
  return {
    title: "조건을 모두 맞추는 근무표를 찾지 못했어요",
    subtitle: "",
    cause: { tag: "충돌 원인", headline: "", detail: "" },
    options: [],
  };
}
