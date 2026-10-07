import { redirect } from "next/navigation";
import { ApiError } from "@/lib/apiClient";
import AppShell from "@/components/layout/AppShell";
import { getShellInfo } from "@/services/shellApi";
import type { ShellInfo } from "@/types/shell.type";

// /me를 불러오지 못할 때 쓰는 중립 셸. 가짜 이름은 넣지 않고 전체 메뉴가 보이도록 역할만 수간호사로 둔다.
// TODO: 로그인/세션이 없을 때의 처리는 백엔드 확정 후 결정
const FALLBACK_SHELL: ShellInfo = {
  hospitalName: "",
  wardName: "",
  userName: "-",
  role: "HEAD_NURSE",
  pendingRequestCount: 0,
  pendingApprovalCount: 0,
};

export default async function AppLayout({ children }: LayoutProps<"/">) {
  let shell: ShellInfo | null = null;
  let unauthenticated = false;
  try {
    shell = await getShellInfo();
  } catch (e) {
    // 세션이 없거나 만료되면 로그인으로 보낸다. 서버에 닿지 못한 경우에는 화면 틀만 보여 준다.
    if (!(e instanceof ApiError && e.status === 401)) return <AppShell shell={FALLBACK_SHELL}>{children}</AppShell>;
    unauthenticated = true;
  }
  if (unauthenticated) redirect("/login");
  // 소속이 없으면 소속 선택으로 보낸다 (docs/router.md 진입 분기).
  // TODO: 승인 대기(membership.status) 분기는 status 열거값 확정 후 /onboarding/pending으로 보낸다.
  if (!shell) redirect("/onboarding/select-ward");

  return <AppShell shell={shell}>{children}</AppShell>;
}
