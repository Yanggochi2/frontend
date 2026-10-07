import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import RnErrorState from "@/components/ui/RnErrorState";
import { getShellInfo } from "@/services/shellApi";
import type { ShellInfo } from "@/types/shell.type";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  let shell: ShellInfo | null;
  try {
    shell = await getShellInfo();
  } catch {
    // /me를 불러오지 못하면 가짜 이름을 보여 주지 않고 오류 화면을 보여 준다.
    return (
      <div className="flex min-h-screen-ui items-center justify-center px-12">
        <div className="w-full max-w-[640px]">
          <RnErrorState message="내 정보를 불러오지 못했어요" retryHref="/" />
        </div>
      </div>
    );
  }
  // 소속이 없으면 소속 선택으로 보낸다 (docs/router.md 진입 분기).
  // TODO: 승인 대기(membership.status) 분기는 status 열거값 확정 후 /onboarding/pending으로 보낸다.
  if (!shell) redirect("/onboarding/select-ward");

  return <AppShell shell={shell}>{children}</AppShell>;
}
