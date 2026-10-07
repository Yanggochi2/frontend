import ScheduleButton from "@/components/ui/ScheduleButton";

// 일반 간호사 · 확정 전(공개된 근무표 없음). 초안은 일반 간호사에게 보여주지 않는다 (AGENTS.md 6.1).
export default function ScheduleNurseUnpublished() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-[18px] rounded-[24px] border border-line bg-white px-10 py-[60px] text-center">
      <div className="flex size-[96px] items-center justify-center gap-1 rounded-full bg-brand-soft" aria-hidden>
        <span className="size-1.5 rounded-full bg-brand" />
        <span className="size-1.5 rounded-full bg-brand" />
        <span className="size-1.5 rounded-full bg-brand" />
      </div>
      <p className="max-w-[640px] text-[26px] font-bold text-ink">아직 공개된 근무표가 없어요</p>
      <p className="max-w-[560px] text-[18px] font-medium text-ink-sub">
        수간호사가 근무표를 확정하면 알려 드려요. 그 전에는 연차나 희망 오프를 먼저 신청할 수 있어요.
      </p>
      <ScheduleButton variant="brand" size="md" href="/requests/new">
        새 신청
      </ScheduleButton>
    </div>
  );
}
