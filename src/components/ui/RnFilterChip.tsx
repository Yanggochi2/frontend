"use client";

import type { ReactNode } from "react";

export default function RnFilterChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`h-11 shrink-0 whitespace-nowrap rounded-full px-[18px] text-[16px] font-bold ${
        selected ? "bg-ink text-white" : "bg-surface text-ink-sub"
      }`}
    >
      {children}
    </button>
  );
}

export function RnFilterDivider() {
  return <div className="h-7 w-px shrink-0 bg-line" aria-hidden />;
}
