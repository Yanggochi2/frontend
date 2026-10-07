import AdminChip from "@/components/ui/AdminChip";
import type { MyDutyStats } from "@/types/me.type";
import MyCard from "./MyCard";

export default function MyDutyStatsCard({ stats }: { stats: MyDutyStats }) {
  const tiles = [
    { label: "D 데이", value: stats.d },
    { label: "E 이브닝", value: stats.e },
    { label: "N 나이트", value: stats.n },
    { label: "OFF", value: stats.off },
  ];
  return (
    <MyCard
      title="이번 달 내 근무"
      action={<span className="text-[16px] font-medium text-ink-faint">{stats.periodLabel}</span>}
    >
      <div className="grid w-full grid-cols-4 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="flex flex-col gap-1 rounded-[14px] bg-surface p-4">
            <p className="text-[16px] leading-normal font-medium whitespace-nowrap text-ink-sub">{t.label}</p>
            <p className="text-[34px] leading-normal font-bold text-ink">{t.value}</p>
          </div>
        ))}
      </div>
      <div className="flex w-full items-center gap-3">
        <p className="min-w-0 flex-1 text-[17px] leading-normal font-medium text-ink-sub">OFF 목표 대비</p>
        <AdminChip tone={stats.offTargetTone}>{stats.offTargetLabel}</AdminChip>
      </div>
    </MyCard>
  );
}
