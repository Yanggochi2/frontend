"use client";

import { useState } from "react";
import AdminChip from "@/components/ui/AdminChip";
import AdminFilterChip from "@/components/ui/AdminFilterChip";
import { AdminTableShell, AdminTd, AdminTh, AdminTr } from "@/components/ui/AdminTable";
import { ApiError } from "@/lib/apiClient";
import { patchRule } from "@/services/rulesApi";
import type { RuleCategory, RuleItem, RulesData } from "@/types/rules.type";

// TODO: 카테고리별 규칙 구분(공휴일/OFF 목표 탭의 내용)은 백엔드·명세 확정 후 (RULE-01~05)
export default function RulesTable({ filters, rules: initialRules }: RulesData) {
  const [active, setActive] = useState<RuleCategory>("REQUIRED");
  const [rules, setRules] = useState<RuleItem[]>(initialRules);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<{ id: string; message: string } | null>(null);

  // RULE-02.
  async function update(rule: RuleItem, patch: { enabled?: boolean; strength?: RuleItem["strength"] }) {
    setPendingId(rule.id);
    setError(null);
    try {
      const saved = await patchRule(rule.id, {
        enabled: patch.enabled,
        severity: patch.strength ? (patch.strength === "REQUIRED" ? "HARD" : "SOFT") : undefined,
        // TODO: 백엔드 확정 후 결정 (reason 입력 UI/필수 여부)
      });
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? saved : r)),
      );
    } catch (e) {
      setError({ id: rule.id, message: e instanceof ApiError ? e.message : "저장하지 못했어요. 다시 시도해 주세요." });
    } finally {
      setPendingId(null);
    }
  }
  // 화면 캡처는 필수/권장 6건을 한 표로 보여준다. 탭별 필터링은 명세 확정 후 (TODO)
  const visible = rules; // 꺼진 규칙은 표시만 흐리게 하지 않고 버튼 문구로 구분 (TODO: 디자인 확정 후)

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
              <AdminTd>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={pendingId === r.id}
                      onClick={() => update(r, { enabled: !(r.enabled ?? true) })}
                      className="text-brand disabled:opacity-50"
                    >
                      {(r.enabled ?? true) ? "끄기" : "켜기"}
                    </button>
                    <button
                      type="button"
                      disabled={pendingId === r.id}
                      onClick={() => update(r, { strength: r.strength === "REQUIRED" ? "RECOMMENDED" : "REQUIRED" })}
                      className="text-brand disabled:opacity-50"
                    >
                      강도
                    </button>
                  </div>
                  {error?.id === r.id ? (
                    <span role="alert" className="text-[13px] text-danger">
                      {error.message}
                    </span>
                  ) : null}
                </div>
              </AdminTd>
            </AdminTr>
          ))}
        </tbody>
      </AdminTableShell>
    </>
  );
}
