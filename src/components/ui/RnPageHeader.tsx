import type { ReactNode } from "react";

export default function RnPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex w-full flex-wrap items-center gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h1 className="text-[30px] font-bold text-ink">{title}</h1>
        <p className="text-[18px] font-medium text-ink-sub">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}
