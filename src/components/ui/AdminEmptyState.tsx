import type { ReactNode } from "react";

export default function AdminEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-[18px] rounded-3xl border border-line bg-white px-10 py-[72px] text-center">
      <div className="flex size-24 items-center justify-center rounded-full bg-brand-soft text-[40px] leading-normal font-bold text-brand">
        {icon}
      </div>
      <p className="max-w-[640px] text-[26px] leading-normal font-bold text-ink">{title}</p>
      <p className="max-w-[560px] text-[18px] leading-normal font-medium text-ink-sub">
        {description}
      </p>
      {action}
    </section>
  );
}
