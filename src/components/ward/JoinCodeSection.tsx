"use client";

import { useState } from "react";
import AdminButton from "@/components/ui/AdminButton";
import { useSubmit } from "@/hooks/useSubmit";
import { rotateJoinCode } from "@/services/wardApi";

export default function JoinCodeSection({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const { submit, loading, error } = useSubmit();

  // 초대 링크로 들어온 간호사는 가입 후 소속 선택 화면에 코드가 미리 채워진다 (/signup?code=…).
  async function copy(kind: "code" | "link") {
    const text = kind === "code" ? code : `${window.location.origin}/signup?code=${encodeURIComponent(code)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
    } catch {
      setCopied(null);
    }
  }

  async function rotate() {
    // 이전 코드가 무효가 되므로 한 번 더 확인한다.
    if (!window.confirm("코드를 다시 만들면 이전 코드로는 가입할 수 없어요. 계속할까요?")) return;
    await submit(async () => {
      setCode(await rotateJoinCode());
      setCopied(null);
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-[36px] leading-normal font-bold text-ink">{code}</p>
        <AdminButton onClick={() => copy("code")}>{copied === "code" ? "복사됨" : "복사"}</AdminButton>
        <AdminButton onClick={() => copy("link")}>{copied === "link" ? "링크 복사됨" : "초대 링크 복사"}</AdminButton>
        <AdminButton onClick={rotate} disabled={loading}>코드 다시 만들기</AdminButton>
      </div>
      {error ? <p role="alert" className="text-[16px] font-medium text-danger">{error}</p> : null}
    </>
  );
}
