import type { Metadata } from "next";
import { Black_Han_Sans } from "next/font/google";

const blackHanSans = Black_Han_Sans({
  variable: "--font-black-han-sans",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "오뚜기 · 근무표, 알아서.",
  description: "수간호사의 한 달을 한 번에 짜고, 규칙은 먼저 지키고, 모든 변경은 기록으로 남기는 병동 근무표 서비스 오뚜기.",
};

// 서비스 소개 랜딩. 앱 화면과 달리 80% 비율(ui-zoom)을 쓰지 않는다.
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return <div className={`${blackHanSans.variable} landing-root min-h-screen overflow-x-hidden bg-landing-ink text-[17px] leading-[1.7] text-landing-frost`}>{children}</div>;
}
