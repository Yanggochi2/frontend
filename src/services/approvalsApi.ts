import { approvalsMock } from "@/mocks/approvals.mock";
import type { ApprovalsData } from "@/types/approvals.type";
import type { PreviewState } from "@/types/adminCommon.type";

// TODO: 백엔드 확정 후 실제 요청으로 교체 (주소는 환경 변수로 분리)
export async function getApprovals(state?: PreviewState): Promise<ApprovalsData> {
  if (state === "error") throw new Error("approvals load failed");
  if (state === "empty") return { requests: [] };
  return approvalsMock;
}
