import type { ReactNode } from "react";

const TONE = {
  gray: "bg-surface text-ink-sub",
  brand: "bg-primary-soft text-primary",
  danger: "bg-danger-soft text-danger",
} as const;

export default function RnChip({
  tone = "gray",
  children,
}: {
  tone?: keyof typeof TONE;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-[5px] text-[15px] font-bold ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}
