"use client";

import { useRef, useState, type FormEvent } from "react";
import LandingButton from "./LandingButton";

// TODO: 도입 문의 전송 API는 명세에 없다. 지금은 이메일 형식만 확인하고 보내지 않는다.
export default function LandingInquiryForm() {
  const [note, setNote] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = inputRef.current?.value ?? "";
    if (!value || value.indexOf("@") < 1) {
      setNote("업무용 이메일을 입력해 주세요.");
      inputRef.current?.focus();
      return;
    }
    setNote("데모 화면이라 실제로 전송되지는 않아요.");
  }

  return (
    <>
      <form noValidate onSubmit={handleSubmit} className="mt-10 flex flex-wrap justify-center gap-3">
        <label htmlFor="landing-mail" className="sr-only">
          업무용 이메일
        </label>
        <input
          ref={inputRef}
          id="landing-mail"
          type="email"
          placeholder="name@hospital.co.kr"
          autoComplete="email"
          required
          className="min-h-14 w-[min(380px,100%)] rounded-full border-[1.5px] border-[rgb(255_200_218/0.4)] bg-[rgb(28_10_18/0.82)] px-[22px] text-[17px] font-medium text-landing-frost placeholder:text-[#a98794]"
        />
        <LandingButton type="submit">문의하기</LandingButton>
      </form>
      <p role="status" aria-live="polite" className="mt-4 min-h-7 text-[15px] text-landing-blush">
        {note}
      </p>
    </>
  );
}
