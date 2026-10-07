import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  variant: "primary" | "secondary";
  size?: "md" | "lg";
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
  children: ReactNode;
};

// requests/nurses 화면용 버튼. md=48px(헤더·행 버튼), lg=56px(폼·빈 상태 버튼)
export default function RnButton({
  variant,
  size = "md",
  href,
  type = "button",
  onClick,
  className = "",
  children,
}: Props) {
  const cls = `inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] font-bold ${
    size === "lg" ? "h-14 px-7 text-[18px]" : "h-12 px-4 text-[16px]"
  } ${variant === "primary" ? "bg-brand text-white" : "bg-surface text-ink-sub"} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
