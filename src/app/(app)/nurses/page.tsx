import NursesBoard from "@/components/nurses/NursesBoard";
import RnButton from "@/components/ui/RnButton";
import RnEmptyState from "@/components/ui/RnEmptyState";
import RnErrorState from "@/components/ui/RnErrorState";
import RnPageHeader from "@/components/ui/RnPageHeader";
import { getNurses } from "@/services/nursesApi";
import type { NurseListResult } from "@/types/nurses.type";
import type { PreviewState } from "@/types/requests.type";

export default async function NursesPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const preview = state === "empty" || state === "error" ? (state as PreviewState) : undefined;

  let result: NurseListResult | null = null;
  try {
    result = await getNurses(preview);
  } catch {
    result = null;
  }

  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      {result === null ? (
        <>
          <RnPageHeader title="간호사 명단" subtitle="명단을 불러오지 못했어요" />
          <RnErrorState message="간호사 명단을 불러오지 못했어요" retryHref="/nurses" />
        </>
      ) : result.items.length === 0 ? (
        <>
          <RnPageHeader title="간호사 명단" subtitle="재직 0명" />
          <RnEmptyState
            icon="＋"
            title="등록된 간호사가 없어요"
            description="첫 간호사를 등록하면 이 목록에 나타나요. 이름, 역할, 경력을 입력하면 돼요."
            action={
              <RnButton variant="primary" size="lg" href="/nurses/new">
                간호사 등록
              </RnButton>
            }
          />
        </>
      ) : (
        <>
          <RnPageHeader
            title="간호사 명단"
            subtitle={`재직 ${result.activeCount}명 · 퇴사자는 ‘퇴사자 포함’을 켜면 보여요`}
            action={
              <RnButton variant="primary" href="/nurses/new" className="px-[22px] text-[18px]">
                간호사 등록
              </RnButton>
            }
          />
          <NursesBoard items={result.items} />
        </>
      )}
    </div>
  );
}
