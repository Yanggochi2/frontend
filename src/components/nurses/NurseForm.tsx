"use client";

import { useState, type FormEvent } from "react";
import RnButton from "@/components/ui/RnButton";
import { emptyNurseDraft, toNurseCreate } from "@/lib/nurseDraft";
import { formatApiError } from "@/lib/formatApiError";
import { createNurse } from "@/services/nursesApi";
import type { NurseDraft } from "@/types/nurses.type";
import NurseProfileFields from "./NurseProfileFields";
import NurseRegisteredDialog from "./NurseRegisteredDialog";

export default function NurseForm() {
  const [draft, setDraft] = useState<NurseDraft>(() => emptyNurseDraft());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // 권한(role)은 이 화면에서 설정하지 않는다. 새로 등록하는 간호사는 항상 일반 간호사이고,
      // 수간호사 지정은 별도 기능(WARD-09 권한 부여)으로만 한다.
      // TODO: preceptorOf 선택 UI는 시안에 없다.
      await createNurse(toNurseCreate(draft));
      setRegistered(draft.name.trim());
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="flex items-start gap-6">
        <div className="grid w-full max-w-[904px] flex-1 grid-cols-2 gap-x-6 gap-y-7 rounded-[20px] border border-line bg-white p-8">
          <NurseProfileFields draft={draft} onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))} />
        </div>

        <aside className="flex w-[416px] shrink-0 flex-col gap-3.5 rounded-[20px] bg-brand-soft p-7">
          <h2 className="text-[20px] font-bold text-brand">등록하면</h2>
          {[
            "· 근무표에 이 간호사의 줄이 생겨요",
            "· 소속 시작일 전 날짜는 회색으로 막혀요",
            "· 일반 간호사에게는 이름과 역할만 보여요",
            "· 차지, 신입 같은 역할은 규칙에 따라 자동으로 검사돼요",
          ].map((t) => (
            <p key={t} className="text-[17px] font-medium text-ink">
              {t}
            </p>
          ))}
        </aside>
      </div>

      <div className="flex items-center justify-end gap-3">
        {error ? (
          <p role="alert" className="mr-auto text-[16px] font-medium text-danger">
            {error}
          </p>
        ) : null}
        <RnButton variant="secondary" size="lg" href="/nurses">
          취소
        </RnButton>
        <RnButton variant="primary" size="lg" type="submit" disabled={busy} className="px-10">
          등록하기
        </RnButton>
      </div>

      {registered ? (
        <NurseRegisteredDialog
          name={registered}
          onAddAnother={() => {
            setDraft(emptyNurseDraft());
            setRegistered(null);
            setError(null);
          }}
        />
      ) : null}
    </form>
  );
}
