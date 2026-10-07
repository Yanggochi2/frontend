"use client";

import OnboardingButton from "@/components/ui/OnboardingButton";
import { useLogout } from "@/hooks/useLogout";

export default function PendingLogoutButton() {
  const { run, loading, error } = useLogout();
  return (
    <>
      <OnboardingButton variant="secondary" onClick={run} disabled={loading}>
        로그아웃
      </OnboardingButton>
      {error ? <p role="alert" className="w-full text-base font-medium text-danger">{error}</p> : null}
    </>
  );
}
