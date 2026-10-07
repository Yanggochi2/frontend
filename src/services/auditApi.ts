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

function stringify(value: unknown): string {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value : JSON.stringify(value);
}

function toEntry(log: ApiAuditLog): AuditEntry {
  const before = stringify(log.before);
  const after = stringify(log.after);
  return {
    id: log.id,
    occurredAt: formatOccurredAt(log.occurredAt),
    // TODO: 백엔드 확정 후 결정 (행위자 이름 필드 없음 → actorId 표시. 이름은 별도 조회/필드 필요)
    actorName: log.actorId,
    // TODO: 백엔드 확정 후 결정 (actionType 한글 라벨/톤 매핑 없음 → 코드 그대로)
    actionLabel: log.actionType,
    actionTone: "gray",
    targetText: `${log.targetType} ${log.targetId}`.trim(),
    detailText: before || after ? `${before || "-"} → ${after || "-"}` : "-",
  };
}

// 감사 로그는 보기 전용 (SEC-02). SEC-01만 쓴다.
export async function getAuditLog(query: AuditLogQuery = {}): Promise<AuditLogData> {
  const result = await apiRequestList<ApiAuditLog>("/wards/me/audit-logs", { query });
  // TODO: 필터 칩 동작과 페이지네이션(meta) UI는 백엔드 확정 후 연결
  return { filters: AUDIT_FILTER_CHIPS, entries: result.data.map(toEntry) };
}
