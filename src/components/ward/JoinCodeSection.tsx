"use client";

import { useState } from "react";
import AdminButton from "@/components/ui/AdminButton";
import { useSubmit } from "@/hooks/useSubmit";
import { rotateJoinCode } from "@/services/wardApi";

export default function JoinCodeSection({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const { submit, loading, error } = useSubmit();

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function rotate() {
    // 이전 코드가 무효가 되므로 한 번 더 확인한다.
    if (!window.confirm("코드를 다시 만들면 이전 코드로는 가입할 수 없어요. 계속할까요?")) return;
    await submit(async () => {
      setCode(await rotateJoinCode());
      setCopied(false);
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-[36px] leading-normal font-bold text-ink">{code}</p>
        <AdminButton onClick={copy}>{copied ? "복사됨" : "복사"}</AdminButton>
        <AdminButton onClick={rotate} disabled={loading}>코드 다시 만들기</AdminButton>
      </div>
      {error ? <p role="alert" className="text-[16px] font-medium text-danger">{error}</p> : null}
    </>
  );
}
