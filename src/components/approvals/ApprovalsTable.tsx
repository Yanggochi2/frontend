import AdminChip from "@/components/ui/AdminChip";
import { AdminTableShell, AdminTd, AdminTh, AdminTr } from "@/components/ui/AdminTable";
import ApprovalRowActions from "./ApprovalRowActions";
import type { JoinRequest } from "@/types/approvals.type";

export default function ApprovalsTable({ requests }: { requests: JoinRequest[] }) {
  return (
    <AdminTableShell minWidth="min-w-[860px]">
      <thead>
        <tr>
          <AdminTh first className="w-[200px]">이름</AdminTh>
          <AdminTh className="w-[260px]">신청 시각</AdminTh>
          <AdminTh className="w-[200px]">병동 코드</AdminTh>
          <AdminTh className="w-[200px]">들어오는 권한</AdminTh>
          <AdminTh>처리</AdminTh>
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => (
          <AdminTr key={r.id}>
            <AdminTd first>{r.name}</AdminTd>
            <AdminTd>{r.requestedAt}</AdminTd>
            <AdminTd>{r.wardCode}</AdminTd>
            <AdminTd>
              <AdminChip>{r.grantedRoleLabel}</AdminChip>
            </AdminTd>
            <AdminTd>
              <ApprovalRowActions id={r.id} />
            </AdminTd>
          </AdminTr>
        ))}
      </tbody>
    </AdminTableShell>
  );
}
