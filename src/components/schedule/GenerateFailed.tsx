import ScheduleButton from "@/components/ui/ScheduleButton";
import ScheduleChip from "@/components/ui/ScheduleChip";
import SchedulePageHeader from "@/components/ui/SchedulePageHeader";
import type { GenerationFailure } from "@/types/schedule.type";

export default function GenerateFailed({ data }: { data: GenerationFailure }) {
  return (
    <>
      <SchedulePageHeader title={data.title} subtitle={data.subtitle} />
      {/* 연한 빨강 배경/테두리(#fff5f5, #ffd6d6)는 토큰에 없어 임의 값 사용 */}
      <section className="flex w-full flex-col items-start gap-2.5 rounded-[20px] border border-[#ffd6d6] bg-[#fff5f5] px-7 py-[26px]">
        <ScheduleChip tone="danger">{data.cause.tag}</ScheduleChip>
        <p className="text-[24px] font-bold text-ink">{data.cause.headline}</p>
        <p className="text-[17px] font-medium text-ink-sub">{data.cause.detail}</p>
      </section>
      <ul className="grid w-full grid-cols-3 gap-6">
        {data.options.map((o) => (
          <li key={o.id} className="flex flex-col items-start gap-2.5 rounded-[20px] border border-line bg-white px-7 py-[26px]">
            <ScheduleChip tone={o.badge.tone}>{o.badge.label}</ScheduleChip>
            <p className="text-[20px] font-bold text-ink">{o.title}</p>
            <p className="text-[16px] font-medium text-ink-sub">{o.description}</p>
            {/* TODO: 이 방법으로 다시 만들기 동작은 백엔드 확정 후 */}
            <ScheduleButton variant={o.primary ? "brand" : "neutral"} size="xs">
              이 방법으로 다시 만들기
            </ScheduleButton>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-start gap-3">
        <ScheduleButton variant="neutral" size="sm" href="/schedule">
          부분 결과 그대로 쓰고 직접 고치기
        </ScheduleButton>
        <ScheduleButton variant="neutral" size="sm" href="/schedule">
          취소
        </ScheduleButton>
      </div>
    </>
  );
}
