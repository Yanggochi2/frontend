import { redirect } from "next/navigation";

// TODO: 접근 상태별 진입 분기(로그인 / 소속 선택 / 승인 대기)는 백엔드 확정 후 처리
export default function HomePage() {
  redirect("/schedule");
}
