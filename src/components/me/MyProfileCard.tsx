import AdminChip from "@/components/ui/AdminChip";
import type { ReactNode } from "react";
import type { MyProfile } from "@/types/me.type";
import MyCard from "./MyCard";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-3 py-[7px]">
      <p className="min-w-0 flex-1 text-[17px] leading-normal font-medium text-ink-sub">{label}</p>
      {typeof children === "string" ? (
        <p className="shrink-0 text-[18px] leading-normal font-bold text-ink">{children}</p>
      ) : (
        children
      )}
    </div>
  );
}

export default function MyProfileCard({ profile }: { profile: MyProfile }) {
  return (
    <MyCard>
      <div className="flex items-center gap-[18px]">
        <div className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-brand-soft text-[30px] leading-normal font-bold text-brand">
          {profile.name.slice(0, 1)}
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <p className="text-[26px] leading-normal font-bold text-ink">{profile.name}</p>
          <AdminChip tone={profile.roleTone}>{profile.roleLabel}</AdminChip>
        </div>
      </div>
      <Row label="이메일">{profile.email}</Row>
      <Row label="병동">{profile.wardLabel}</Row>
      <Row label="권한">
        <AdminChip tone={profile.roleTone}>{profile.roleLabel}</AdminChip>
      </Row>
      {profile.dutyRoleLabel ? (
        <Row label="듀티 역할">
          <AdminChip tone={profile.dutyRoleTone}>{profile.dutyRoleLabel}</AdminChip>
        </Row>
      ) : null}
      {profile.careerText ? <Row label="총 경력">{profile.careerText}</Row> : null}
      {profile.skillLevel !== undefined ? <Row label="숙련도">{String(profile.skillLevel)}</Row> : null}
      <Row label="소속 시작일">{profile.joinedAt}</Row>
      <p className="w-full text-[16px] leading-normal font-medium text-ink-faint">{profile.editHint}</p>
    </MyCard>
  );
}
