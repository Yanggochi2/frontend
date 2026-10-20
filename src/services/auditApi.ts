import { AUDIT_FILTER_CHIPS } from "@/constants/audit.constants";
import { apiRequestList } from "@/lib/apiClient";
import type { ApiAuditLog, AuditLogQuery } from "@/types/auditApi.type";
import type { AuditEntry, AuditLogData } from "@/types/audit.type";

function formatOccurredAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const ACTIONS: Record<string, { label: string; tone: "gray" | "blue" | "red"; detail: string }> = {
  WARD_CREATED: { label: "병동 설정 완료", tone: "blue", detail: "병동과 기본 근무 인원을 설정했어요." },
  NURSE_CREATED: { label: "간호사 등록", tone: "blue", detail: "근무표에 배정할 간호사를 추가했어요." },
  NURSE_UPDATED: { label: "간호사 정보 변경", tone: "gray", detail: "간호사의 재직 상태나 근무 정보를 바꿨어요." },
  NURSE_RETIRED: { label: "퇴사 처리", tone: "red", detail: "해당 간호사를 자동 편성 대상에서 제외했어요." },
  REQUEST_CREATED: { label: "근무 신청", tone: "blue", detail: "연차나 희망 OFF 신청이 등록됐어요." },
  REQUEST_APPROVED: { label: "근무 신청 승인", tone: "blue", detail: "승인된 신청을 자동 편성에 반영해요." },
  REQUEST_REJECTED: { label: "근무 신청 반려", tone: "red", detail: "근무 신청을 반려했어요." },
  REQUEST_CANCELLED: { label: "근무 신청 취소", tone: "gray", detail: "신청자가 근무 신청을 취소했어요." },
  RULE_UPDATED: { label: "편성 기준 변경", tone: "gray", detail: "자동 근무표에 적용할 기준을 바꿨어요." },
  SCHEDULE_CREATED: { label: "빈 근무표 생성", tone: "blue", detail: "해당 월의 근무표를 준비했어요." },
  SCHEDULE_GENERATED: { label: "자동 편성 완료", tone: "blue", detail: "승인된 연차·희망 OFF와 병동 기준으로 근무표를 만들었어요." },
  SCHEDULE_CELLS_UPDATED: { label: "근무표 수정", tone: "gray", detail: "간호사의 근무 배정을 직접 바꿨어요." },
  SCHEDULE_CONFIRMED: { label: "근무표 확정", tone: "blue", detail: "병동 구성원에게 공유할 근무표를 확정했어요." },
};

const TARGETS: Record<string, string> = { WARD: "병동", NURSE: "간호사", WORK_REQUEST: "근무 신청", RULE: "편성 기준", SCHEDULE: "근무표" };

function toEntry(log: ApiAuditLog): AuditEntry {
  const action = ACTIONS[log.actionType] ?? { label: "병동 정보 변경", tone: "gray" as const, detail: "병동 운영 정보가 변경됐어요." };
  return {
    id: log.id,
    occurredAt: formatOccurredAt(log.occurredAt),
    actorName: log.actorName ?? "확인할 수 없음",
    actionLabel: action.label,
    actionTone: action.tone,
    targetText: TARGETS[log.targetType] ?? "병동 정보",
    detailText: action.detail,
  };
}

// 감사 로그는 보기 전용 (SEC-02). SEC-01만 쓴다.
export async function getAuditLog(query: AuditLogQuery = {}): Promise<AuditLogData> {
  const result = await apiRequestList<ApiAuditLog>("/wards/me/audit-logs", { query });
  // TODO: 필터 칩 동작과 페이지네이션(meta) UI는 백엔드 확정 후 연결
  return { filters: AUDIT_FILTER_CHIPS, entries: result.data.map(toEntry) };
}
