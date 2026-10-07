import { headNurseMyPageMock, nurseMyPageMock } from "@/mocks/me.mock";
import type { PreviewState } from "@/types/adminCommon.type";
import type { MyPageData, MyPageRole } from "@/types/me.type";

// TODO: 본인 리소스는 `me`로 조회. 역할은 서버가 세션에서 판정하므로 role 인자는 미리보기 전용이며
// 백엔드 연결 시 제거한다. 요청 본문/쿼리에 role을 담지 않는다.
export async function getMyPage(previewRole?: MyPageRole, state?: PreviewState): Promise<MyPageData> {
  if (state === "error") throw new Error("my page load failed");
  return previewRole === "NURSE" ? nurseMyPageMock : headNurseMyPageMock;
}
