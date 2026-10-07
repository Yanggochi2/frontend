"use client";

import { useState } from "react";
import AdminChip from "@/components/ui/AdminChip";
import AdminFilterChip from "@/components/ui/AdminFilterChip";
import { AdminTableShell, AdminTd, AdminTh, AdminTr } from "@/components/ui/AdminTable";
import type { RuleCategory, RulesData } from "@/types/rules.type";

// TODO: 카테고리별 규칙 구분(공휴일/OFF 목표 탭의 내용)은 백엔드·명세 확정 후 (RULE-01~05)
export default function RulesTable({ filters, rules }: RulesData) {
  const [active, setActive] = useState<RuleCategory>("REQUIRED");
  // 화면 캡처는 필수/권장 6건을 한 표로 보여준다. 탭별 필터링은 명세 확정 후 (TODO)
  const visible = rules;

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-2.5">
        {filters.map((f) => (
          <AdminFilterChip key={f.key} active={active === f.key} onClick={() => setActive(f.key)}>
            {f.label}
          </AdminFilterChip>
        ))}
      </div>
      <AdminTableShell minWidth="min-w-[1000px]">
        <thead>
          <tr>
            <AdminTh first className="w-[520px]">규칙</AdminTh>
            <AdminTh className="w-[140px]">강도</AdminTh>
            <AdminTh className="w-[300px]">값</AdminTh>
            <AdminTh className="w-[264px]">적용 대상</AdminTh>
            <AdminTh className="w-[120px]">
              <span className="sr-only">수정</span>
            </AdminTh>
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => (
            <AdminTr key={r.id}>
              <AdminTd first>{r.name}</AdminTd>
              <AdminTd>
                <AdminChip tone={r.strength === "REQUIRED" ? "red" : "gray"}>
                  {r.strength === "REQUIRED" ? "필수" : "권장"}
                </AdminChip>
              </AdminTd>
              <AdminTd>{r.valueText}</AdminTd>
              <AdminTd>{r.targetText}</AdminTd>
              <AdminTd>수정</AdminTd>
            </AdminTr>
          ))}
        </tbody>
      </AdminTableShell>
    </>
  );
}
