"use client";

import { useState } from "react";
import AdminButton from "@/components/ui/AdminButton";
import AdminFilterChip from "@/components/ui/AdminFilterChip";
import type { RuleFilterKey, RuleItem, RulesData } from "@/types/rules.type";
import HolidayPanel from "./HolidayPanel";
import RuleEditorDialog from "./RuleEditorDialog";
import RulesTable from "./RulesTable";

// 규칙 화면 본문: 탭, 규칙 목록, 추가·수정 창, 공휴일 탭
export default function RulesBoard({ filters, rules: initialRules }: RulesData) {
  const [active, setActive] = useState<RuleFilterKey>("ALL");
  const [rules, setRules] = useState<RuleItem[]>(initialRules);
  // undefined: 닫힘, null: 새 규칙 추가, RuleItem: 그 규칙 수정
  const [editing, setEditing] = useState<RuleItem | null | undefined>(undefined);

  const visible = active === "ALL" ? rules : rules.filter((r) => r.strength === active);

  function upsert(saved: RuleItem) {
    setRules((prev) => (prev.some((r) => r.id === saved.id) ? prev.map((r) => (r.id === saved.id ? saved : r)) : [...prev, saved]));
  }

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-2.5">
        {filters.map((f) => (
          <AdminFilterChip key={f.key} active={active === f.key} onClick={() => setActive(f.key)}>
            {f.label}
          </AdminFilterChip>
        ))}
        {active === "HOLIDAY" ? null : (
          <div className="ml-auto">
            <AdminButton variant="primary" onClick={() => setEditing(null)}>
              + 규칙 추가
            </AdminButton>
          </div>
        )}
      </div>
      {active === "HOLIDAY" ? (
        <HolidayPanel />
      ) : (
        <RulesTable
          rules={visible}
          onEdit={setEditing}
          onChanged={upsert}
          onDeleted={(id) => setRules((prev) => prev.filter((r) => r.id !== id))}
        />
      )}
      {editing !== undefined ? (
        <RuleEditorDialog
          rule={editing}
          onSaved={(saved) => {
            upsert(saved);
            setEditing(undefined);
          }}
          onClose={() => setEditing(undefined)}
        />
      ) : null}
    </>
  );
}
