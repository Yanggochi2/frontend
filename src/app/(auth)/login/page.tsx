import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// ?code= 는 병동 초대 링크로 들어온 코드다. 로그인 후 소속 선택 화면에 넘긴다.
export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const code = (await searchParams).code;
  return (
    <AuthCard title="로그인" description="병동 근무표를 보려면 로그인해 주세요">
      <LoginForm joinCode={typeof code === "string" ? code : undefined} />
    </AuthCard>
  );
}
