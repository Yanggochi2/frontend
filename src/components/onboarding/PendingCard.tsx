import OnboardingButton from "@/components/ui/OnboardingButton";
import OnboardingCard from "@/components/ui/OnboardingCard";
import PendingCheckButton from "./PendingCheckButton";
import PendingLogoutButton from "./PendingLogoutButton";
import type { PendingInfo } from "@/types/onboarding.type";

type Props = { info: PendingInfo };

export default function PendingCard({ info }: Props) {
  return (
    <OnboardingCard className="flex w-full max-w-160 flex-col items-center gap-[18px] px-12 py-14 text-center">
      <div
        aria-hidden="true"
        className="flex size-24 items-center justify-center rounded-full bg-primary-soft text-[40px] font-bold text-primary"
      >
        …
      </div>
      <h1 className="text-[26px] font-bold text-ink">
        수간호사의 승인을 기다리고 있어요
      </h1>
      <p className="text-lg font-medium text-ink-sub">
        승인되면 바로 근무표를 볼 수 있어요.
      </p>
      <dl className="flex w-full flex-col gap-2 rounded-2xl bg-surface px-6 py-[18px] text-left text-[17px] font-medium">
        <div className="flex gap-2 text-ink">
          <dt>병동</dt>
          <dd>
            {info.hospitalName} · {info.wardName}
          </dd>
        </div>
        <div className="flex gap-2 text-ink-sub">
          <dt>신청 시각</dt>
          <dd>{info.requestedAt}</dd>
        </div>
      </dl>
      <PendingCheckButton />
      <div className="flex flex-wrap justify-center gap-3">
        <OnboardingButton variant="secondary" href="/onboarding/select-ward">
          코드 다시 입력
        </OnboardingButton>
        <PendingLogoutButton />
      </div>
    </OnboardingCard>
  );
}
