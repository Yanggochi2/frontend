import type { ReactNode } from "react";

type Props = {
  href?: string;
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  type?: "button" | "submit";
  children: ReactNode;
};

const VARIANT = {
  primary:
    "bg-landing-brand text-white shadow-[0_10px_40px_-10px_rgb(184_50_95/0.95),inset_0_0_0_1px_rgb(255_190_210/0.28)]",
  ghost: "border-[rgb(255_200_218/0.5)] bg-white/5 text-white",
} as const;

const SIZE = { md: "min-h-12 px-[26px] text-[16px]", sm: "min-h-[42px] px-5 text-[15px]" } as const;

// 랜딩 전용 알약 모양 버튼. href가 있으면 같은 페이지 안 링크로 쓴다.
export default function LandingButton({ href, variant = "primary", size = "md", type = "button", children }: Props) {
  const cls = `inline-flex cursor-pointer items-center justify-center rounded-full border-[1.5px] border-transparent font-bold no-underline ${VARIANT[variant]} ${SIZE[size]}`;
  return href ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <button type={type} className={cls}>
      {children}
    </button>
  );
}
