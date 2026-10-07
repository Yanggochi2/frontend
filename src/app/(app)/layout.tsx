import { redirect } from "next/navigation";
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
  let shell: ShellInfo | null;
  try {
    shell = await getShellInfo();
  } catch {
    return <AppShell shell={FALLBACK_SHELL}>{children}</AppShell>;
  }
  // 소속이 없으면 소속 선택으로 보낸다 (docs/router.md 진입 분기).
  // TODO: 승인 대기(membership.status) 분기는 status 열거값 확정 후 /onboarding/pending으로 보낸다.
  if (!shell) redirect("/onboarding/select-ward");

  return <AppShell shell={shell}>{children}</AppShell>;
}
