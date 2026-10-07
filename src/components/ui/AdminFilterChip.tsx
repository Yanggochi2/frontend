import type { ReactNode } from "react";

export default function AdminFilterChip({
  active = false,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-11 shrink-0 items-center justify-center rounded-full px-[18px] text-[16px] leading-normal font-bold whitespace-nowrap ${
        active ? "bg-ink text-white" : "bg-surface text-ink-sub"
      }`}
    >
      {children}
    </button>
  );
}
