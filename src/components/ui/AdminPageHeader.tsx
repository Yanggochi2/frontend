import type { ReactNode } from "react";

export default function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex w-full flex-wrap items-center gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h1 className="text-[30px] leading-normal font-bold text-ink">{title}</h1>
        {subtitle ? (
          <p className="text-[18px] leading-normal font-medium text-ink-sub">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
