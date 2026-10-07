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
};

// TODO: onClick 등 동작은 백엔드 연동 후 연결 (지금은 UI만)
export default function AdminButton({ variant = "secondary", size = "sm", href, children }: Props) {
  const cls = `inline-flex shrink-0 items-center justify-center rounded-[12px] leading-normal font-bold whitespace-nowrap ${variants[variant]} ${sizes[size]}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls}>
      {children}
    </button>
  );
}
