import type { ReactNode } from "react";

export type AdminChipTone = "gray" | "blue" | "red";

const tones: Record<AdminChipTone, string> = {
  gray: "bg-surface text-ink-sub",
  blue: "bg-primary-soft text-primary",
  red: "bg-danger-soft text-danger",
};

export default function AdminChip({
  tone = "gray",
  children,
}: {
  tone?: AdminChipTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-[5px] text-[15px] leading-normal font-bold whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
