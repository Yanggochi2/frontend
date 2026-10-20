import AdminChip from "@/components/ui/AdminChip";
import { AdminTableEmptyRow, AdminTableShell, AdminTd, AdminTh, AdminTr } from "@/components/ui/AdminTable";
import ApprovalRowActions from "./ApprovalRowActions";
import type { JoinRequest } from "@/types/approvals.type";
import type { Nurse } from "@/types/nurses.type";

export default function ApprovalsTable({ requests, unlinkedNurses }: { requests: JoinRequest[]; unlinkedNurses: Nurse[] }) {
  return (
    <AdminTableShell minWidth="min-w-[1000px]">
      <thead>
        <tr>
          <AdminTh first className="w-[200px]">이름</AdminTh>
          <AdminTh className="w-[260px]">신청 시각</AdminTh>
          <AdminTh className="w-[260px]">이메일</AdminTh>
          <AdminTh className="w-[200px]">들어오는 권한</AdminTh>
          <AdminTh>처리</AdminTh>
        </tr>
      </thead>
      <tbody>
        {requests.length === 0 ? <AdminTableEmptyRow colSpan={5}>기다리는 가입 신청이 없어요</AdminTableEmptyRow> : null}
        {requests.map((r) => (
          <AdminTr key={r.id}>
            <AdminTd first>{r.name}</AdminTd>
            <AdminTd>{r.requestedAt}</AdminTd>
            <AdminTd>{r.email}</AdminTd>
            <AdminTd>
              <AdminChip>{r.grantedRoleLabel}</AdminChip>
            </AdminTd>
            <AdminTd>
              <ApprovalRowActions request={r} unlinkedNurses={unlinkedNurses} />
            </AdminTd>
          </AdminTr>
        ))}
      </tbody>
    </AdminTableShell>
  );
}
