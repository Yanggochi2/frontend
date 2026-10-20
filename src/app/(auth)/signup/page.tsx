import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// ?code= 는 병동 초대 링크로 들어온 코드다. 가입 후 소속 선택 화면에 미리 채운다.
export default async function SignupPage({ searchParams }: { searchParams: SearchParams }) {
  const code = (await searchParams).code;
  return (
    <AuthCard title="회원가입" description="가입한 뒤 병동 코드를 입력하거나 새 병동을 만들어요">
      <SignupForm joinCode={typeof code === "string" ? code : undefined} />
    </AuthCard>
  );
}
