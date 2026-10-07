import { Suspense } from "react";
import AppShell from "@/components/layout/AppShell";
import { getShellInfo } from "@/services/shellApi";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const shell = await getShellInfo();

  return (
    <Suspense>
      <AppShell shell={shell}>{children}</AppShell>
    </Suspense>
  );
}
