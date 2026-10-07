import Link from "next/link";
import AdminChip from "@/components/ui/AdminChip";
import type { MyRequest } from "@/types/me.type";
import MyCard from "./MyCard";

export default function MyRequestsCard({ requests }: { requests: MyRequest[] }) {
  return (
    <MyCard
      title="내 신청 내역"
      action={
        <Link href="/requests" className="text-[16px] font-bold whitespace-pre text-primary">
          {"전체 보기  ›"}
        </Link>
      }
    >
      {requests.length === 0 ? (
        <p className="w-full py-4 text-[17px] font-medium text-ink-sub">신청 내역이 없어요</p>
      ) : (
        requests.map((r) => (
          <div key={r.id} className="flex w-full items-center gap-3 py-3.5">
            <AdminChip>{r.typeLabel}</AdminChip>
            <p className="min-w-0 flex-1 text-[18px] leading-normal font-bold text-ink">{r.dateLabel}</p>
            <AdminChip tone={r.statusTone}>{r.statusLabel}</AdminChip>
            {r.cancellable ? (
              <button type="button" className="shrink-0 text-[16px] font-bold text-ink-sub">
                취소
              </button>
            ) : null}
          </div>
        ))
      )}
    </MyCard>
  );
}
