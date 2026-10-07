import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "brand" | "neutral" | "primary" | "primary-soft";
type Size = "sm" | "md" | "xs" | "bar";

const VARIANT: Record<Variant, string> = {
  brand: "bg-primary text-white",
  neutral: "bg-surface text-ink-sub",
  primary: "bg-primary text-white",
  "primary-soft": "bg-primary-soft text-primary",
};

const SIZE: Record<Size, string> = {
  xs: "min-h-12 rounded-[12px] px-4 py-[9px] text-[16px]",
  sm: "min-h-12 rounded-[12px] px-[22px] py-[13px] text-[18px]",
  md: "h-14 rounded-[12px] px-7 text-[18px]",
  bar: "rounded-[16px] px-[34px] py-4 text-[20px]",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export default function ScheduleButton({
  variant = "neutral",
  size = "sm",
  href,
  children,
  className = "",
  ...rest
}: Props) {
  const cls = `inline-flex items-center justify-center whitespace-nowrap font-bold ${VARIANT[variant]} ${SIZE[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
