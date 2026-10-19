import AdminChip from "@/components/ui/AdminChip";
import { AdminTableEmptyRow, AdminTableShell, AdminTd, AdminTh, AdminTr } from "@/components/ui/AdminTable";
import type { RuleItem } from "@/types/rules.type";
import RuleRowActions from "./RuleRowActions";

type Props = {
  rules: RuleItem[];
  onEdit: (rule: RuleItem) => void;
  onChanged: (rule: RuleItem) => void;
  onDeleted: (id: string) => void;
};

export default function RulesTable({ rules, onEdit, onChanged, onDeleted }: Props) {
  return (
    <AdminTableShell minWidth="min-w-[1000px]">
      <thead>
        <tr>
          <AdminTh first className="w-[260px]">규칙</AdminTh>
          <AdminTh>내용</AdminTh>
          <AdminTh className="w-[110px]">강도</AdminTh>
          <AdminTh className="w-[110px]">사용</AdminTh>
          <AdminTh className="w-[200px]">
            <span className="sr-only">관리</span>
          </AdminTh>
        </tr>
      </thead>
      <tbody>
        {rules.length === 0 ? <AdminTableEmptyRow colSpan={5}>규칙이 없어요</AdminTableEmptyRow> : null}
        {rules.map((r) => (
          <AdminTr key={r.id}>
            <AdminTd first className={r.enabled ? "" : "text-ink-mute"}>
              <div className="flex flex-col gap-0.5">
                <span>{r.name}</span>
                {r.builtIn ? <span className="text-[14px] font-medium text-ink-mute">기본 규칙</span> : null}
              </div>
            </AdminTd>
            <AdminTd className={`whitespace-normal ${r.enabled ? "" : "text-ink-mute"}`}>{r.sentence}</AdminTd>
            <AdminTd>
              <AdminChip tone={r.strength === "REQUIRED" ? "red" : "gray"}>
                {r.strength === "REQUIRED" ? "필수" : "권장"}
              </AdminChip>
            </AdminTd>
            <AdminTd>
              <AdminChip tone={r.enabled ? "blue" : "gray"}>{r.enabled ? "켜짐" : "꺼짐"}</AdminChip>
            </AdminTd>
            <AdminTd>
              <RuleRowActions rule={r} onEdit={onEdit} onChanged={onChanged} onDeleted={onDeleted} />
            </AdminTd>
          </AdminTr>
        ))}
      </tbody>
    </AdminTableShell>
  );
}
