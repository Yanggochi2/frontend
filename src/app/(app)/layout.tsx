import { Suspense } from "react";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { getShellInfo } from "@/services/shellApi";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const shell = await getShellInfo();
  // 소속이 없으면 소속 선택으로 보낸다 (docs/router.md 진입 분기).
  // TODO: 승인 대기(membership.status) 분기는 status 열거값 확정 후 /onboarding/pending으로 보낸다.
  if (!shell) redirect("/onboarding/select-ward");

  return (
    <Suspense>
      <AppShell shell={shell}>{children}</AppShell>
    </Suspense>
  );
}
