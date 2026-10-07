import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white",
  secondary: "bg-surface text-ink-sub",
};
const sizes: Record<Size, string> = {
  sm: "h-12 px-4 text-[16px]",
  md: "h-[52px] px-6 text-[18px]",
  lg: "h-14 px-7 text-[18px]",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function AdminButton({ variant = "secondary", size = "sm", href, children, onClick, disabled }: Props) {
  const cls = `inline-flex shrink-0 items-center justify-center rounded-[12px] leading-normal font-bold whitespace-nowrap ${variants[variant]} ${sizes[size]}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={`${cls} ${disabled ? "opacity-60" : ""}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
