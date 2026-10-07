import type { ReactNode } from "react";

type Tone = "gray" | "brand" | "danger" | "ok";

const TONE: Record<Tone, string> = {
  gray: "bg-surface text-ink-sub",
  brand: "bg-primary-soft text-primary",
  danger: "bg-danger-soft text-danger",
  ok: "bg-ok-soft text-ok",
};

type Props = {
  tone?: Tone;
  shape?: "pill" | "square";
  children: ReactNode;
};

export default function ScheduleChip({ tone = "gray", shape = "pill", children }: Props) {
  const radius = shape === "pill" ? "rounded-full px-3 py-[5px]" : "rounded-[10px] px-2.5 py-[5px]";
  return (
    <span className={`inline-flex items-center justify-center whitespace-nowrap text-[15px] font-bold ${radius} ${TONE[tone]}`}>
      {children}
    </span>
  );
}
