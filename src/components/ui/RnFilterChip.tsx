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
      className={`h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-[15px] font-bold transition-colors ${
        selected
          ? "border-primary bg-primary-soft text-primary"
          : "border-line bg-white text-ink-sub hover:bg-surface"
      }`}
    >
      {children}
    </button>
  );
}

export function RnFilterDivider() {
  return <div className="h-7 w-px shrink-0 bg-line" aria-hidden />;
}
