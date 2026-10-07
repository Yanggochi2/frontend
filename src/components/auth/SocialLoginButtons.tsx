"use client";

import { useState, type ReactNode } from "react";

type Provider = "google" | "naver" | "kakao";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-6">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.8z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.28v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.29v-3.1H1.28a12 12 0 0 0 0 10.78l4-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.94 11.94 0 0 0 12 0 12 12 0 0 0 1.28 6.61l4 3.1C6.22 6.88 8.87 4.77 12 4.77z" />
    </svg>
  );
}

function NaverMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
      <path fill="#fff" d="M16.27 12.85 7.38 0H0v24h7.73V11.16L16.62 24H24V0h-7.73z" />
    </svg>
  );
}

function KakaoMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-6">
      <path
        fill="#000"
        d="M12 3C6.48 3 2 6.58 2 11c0 2.86 1.87 5.37 4.7 6.79-.2.75-.73 2.73-.84 3.15-.13.52.19.51.4.37.17-.11 2.65-1.8 3.72-2.53.66.1 1.33.15 2.02.15 5.52 0 10-3.58 10-8S17.52 3 12 3z"
      />
    </svg>
  );
}

// 각 회사 로그인 버튼 가이드의 기본 색을 따른다.
const PROVIDERS: { id: Provider; label: string; mark: ReactNode; className: string }[] = [
  { id: "google", label: "Google로 계속하기", mark: <GoogleMark />, className: "border border-line bg-white text-ink" },
  { id: "kakao", label: "카카오로 계속하기", mark: <KakaoMark />, className: "bg-[#FEE500] text-black/85" },
  { id: "naver", label: "네이버로 계속하기", mark: <NaverMark />, className: "bg-[#03C75A] text-white" },
];

// TODO(🔶 D-03): 소셜 로그인 제공자와 연동 API가 명세에 없다. 확정 전까지 버튼만 두고 누르면 안내만 한다.
export default function SocialLoginButtons() {
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-[15px] font-medium text-ink-mute">
        <span className="h-px flex-1 bg-line" />
        간편 로그인
        <span className="h-px flex-1 bg-line" />
      </div>
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => setNote(`${p.label.replace("로 계속하기", "")} 로그인은 아직 준비 중이에요. 이메일로 로그인해 주세요.`)}
          className={`relative flex h-14 w-full cursor-pointer items-center justify-center rounded-xl text-lg font-bold ${p.className}`}
        >
          <span className="absolute left-5 flex size-6 items-center justify-center">{p.mark}</span>
          {p.label}
        </button>
      ))}
      {note ? (
        <p role="status" className="text-base font-medium text-ink-sub">
          {note}
        </p>
      ) : null}
    </div>
  );
}
