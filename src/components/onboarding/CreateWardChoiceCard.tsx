import OnboardingButton from "@/components/ui/OnboardingButton";
import OnboardingCard from "@/components/ui/OnboardingCard";

export default function CreateWardChoiceCard() {
  return (
    <OnboardingCard className="flex flex-col items-start gap-3.5 p-9">
      <h2 className="text-2xl font-bold text-ink">새 병동을 만들래요</h2>
      <p className="text-[17px] font-medium text-ink-sub">
        수간호사로 시작해요. 병동 코드는 만든 뒤에 받아요
      </p>
      <OnboardingButton variant="secondary" href="/onboarding/create-ward">
        병동 만들기
      </OnboardingButton>
    </OnboardingCard>
  );
}
