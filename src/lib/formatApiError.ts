import { ApiError } from "@/lib/apiClient";

// 화면에 인라인으로 보여줄 오류 문구. 코드와 서버 메시지, 필드 오류를 그대로 쓴다.
export function formatApiError(e: unknown): string {
  if (e instanceof ApiError) {
    const fields = e.fieldErrors?.map((f) => `${f.field}: ${f.reason}`).join(", ");
    return `${e.message} (${e.code})${fields ? ` ${fields}` : ""}`;
  }
  return e instanceof Error ? e.message : "요청에 실패했어요.";
}
