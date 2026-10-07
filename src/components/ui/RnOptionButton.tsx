"use client";

import type { ReactNode } from "react";

// 폼의 단일 선택 버튼 (권한, 듀티 역할, 상태, 숙련도)
export default function RnOptionButton({
  selected,
  onClick,
  className = "min-w-20 px-5 text-[18px]",
  children,
}: {
  selected: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-[52px] items-center justify-center whitespace-nowrap rounded-[14px] ${className} ${
        selected
          ? "border-2 border-primary bg-primary-soft font-bold text-primary"
          : "bg-surface font-medium text-ink-sub"
      }`}
    >
      {children}
    </button>
  );
}
