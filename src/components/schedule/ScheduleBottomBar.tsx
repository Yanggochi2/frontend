import ScheduleButton from "@/components/ui/ScheduleButton";

// 시트 아래 CTA. 화면 높이 안에 시트가 다 들어오도록 고정 배치 대신 흐름 안에 둔다.
export default function ScheduleBottomBar() {
  return (
    <div className="flex shrink-0 items-center justify-end gap-3 pt-3">
      <div className="flex items-center gap-3">
        <ScheduleButton variant="primary-soft" size="bar" href="/schedule/generate">
          자동으로 다시 짜기
        </ScheduleButton>
        {/* TODO: 필수 칸 확인 동작은 화면 연결 시 결정 */}
        <ScheduleButton variant="primary" size="bar">
          필수 칸 확인하기
        </ScheduleButton>
      </div>
    </div>
  );
}
