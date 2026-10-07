import AdminChip from "@/components/ui/AdminChip";
import AdminFilterChip from "@/components/ui/AdminFilterChip";
import { AdminTableShell, AdminTd, AdminTh, AdminTr } from "@/components/ui/AdminTable";
import type { AuditLogData } from "@/types/audit.type";

// 보기 전용: 수정·삭제 UI를 두지 않는다.
export default function AuditLogView({ filters, entries }: AuditLogData) {
  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-3">
        {filters.map((f) => (
          <span key={f.key} className="contents">
            {f.groupStart ? <span aria-hidden className="h-7 w-px bg-line" /> : null}
            <AdminFilterChip active={f.active}>{f.label}</AdminFilterChip>
          </span>
        ))}
      </div>
      <AdminTableShell minWidth="min-w-[1000px]">
        <thead>
          <tr>
            <AdminTh first className="w-[190px]">시각</AdminTh>
            <AdminTh className="w-[130px]">행위자</AdminTh>
            <AdminTh className="w-[200px]">행위</AdminTh>
            <AdminTh className="w-[230px]">대상</AdminTh>
            <AdminTh>변경 내용</AdminTh>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <AdminTr key={e.id}>
              <AdminTd first>{e.occurredAt}</AdminTd>
              <AdminTd>{e.actorName}</AdminTd>
              <AdminTd>
                <AdminChip tone={e.actionTone}>{e.actionLabel}</AdminChip>
              </AdminTd>
              <AdminTd>{e.targetText}</AdminTd>
              <AdminTd>{e.detailText}</AdminTd>
            </AdminTr>
          ))}
        </tbody>
      </AdminTableShell>
    </>
  );
}
