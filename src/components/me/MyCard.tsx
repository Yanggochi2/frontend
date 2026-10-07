import type { ReactNode } from "react";

export default function MyCard({
  title,
  action,
  gap = "gap-4",
  children,
}: {
  title?: string;
  action?: ReactNode;
  gap?: string;
  children: ReactNode;
}) {
  return (
    <section className={`flex w-full flex-col items-start rounded-[20px] border border-line bg-white px-7 py-[26px] ${gap}`}>
      {title ? (
        <div className="flex w-full items-center gap-3">
          <h2 className="min-w-0 flex-1 text-[22px] leading-normal font-bold text-ink">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
