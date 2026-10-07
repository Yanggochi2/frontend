import CreateWardChoiceCard from "@/components/onboarding/CreateWardChoiceCard";
import OnboardingHeading from "@/components/onboarding/OnboardingHeading";
import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import WardCodeCard from "@/components/onboarding/WardCodeCard";
import { getSelectWardInfo } from "@/services/onboardingApi";

export default async function SelectWardPage() {
  const info = await getSelectWardInfo();
  return (
    <div className="flex min-h-screen-ui flex-col">
      <OnboardingTopBar />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-6">
        <OnboardingHeading
          title="어느 병동에서 일하세요?"
          description="병동 코드가 있으면 입력하고, 없으면 새 병동을 만들어요"
        />
        <div className="grid w-full max-w-278 grid-cols-2 items-start gap-6">
          <WardCodeCard placeholder={info.codePlaceholder} />
          <CreateWardChoiceCard />
        </div>
      </div>
    </div>
  );
}
