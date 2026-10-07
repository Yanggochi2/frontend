"use client";

import AdminButton from "@/components/ui/AdminButton";
import { useLogout } from "@/hooks/useLogout";
import MyCard from "./MyCard";

export default function MyAccountCard() {
  const { run, loading, error } = useLogout();
  return (
    <MyCard title="계정">
      <div className="flex flex-wrap gap-3">
        <AdminButton size="md">비밀번호 변경</AdminButton>
        <AdminButton size="md" onClick={run} disabled={loading}>로그아웃</AdminButton>
      </div>
      {error ? <p role="alert" className="text-[16px] font-medium text-danger">{error}</p> : null}
    </MyCard>
  );
}
