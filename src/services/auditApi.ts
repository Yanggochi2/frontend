import { auditMock } from "@/mocks/audit.mock";
import type { PreviewState } from "@/types/adminCommon.type";
import type { AuditLogData } from "@/types/audit.type";

// TODO: 백엔드 확정 후 실제 요청으로 교체. 감사 로그는 보기 전용 (SEC-02)
export async function getAuditLog(state?: PreviewState): Promise<AuditLogData> {
  if (state === "error") throw new Error("audit log load failed");
  if (state === "empty") return { ...auditMock, entries: [] };
  return auditMock;
}
