import type { ReactNode } from "react";

export default function AdminNotice({
  tone = "blue",
  children,
}: {
  tone?: "blue" | "red";
  children: ReactNode;
}) {
  // TODO: 빨간 안내 배경(#fff5f5)·글자(#c92a3a)는 토큰이 없어 임의 값 사용
  const cls = tone === "blue" ? "bg-brand-soft text-[#1b64da]" : "bg-[#fff5f5] text-[#c92a3a]";
  return (
    <p className={`w-full rounded-[14px] px-5 py-4 text-[17px] leading-normal font-medium ${cls}`}>
      {children}
    </p>
  );
}
