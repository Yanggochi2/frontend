import AdminButton from "@/components/ui/AdminButton";
import MyCard from "./MyCard";

export default function MyAccountCard() {
  return (
    <MyCard title="계정">
      <div className="flex flex-wrap gap-3">
        <AdminButton size="md">비밀번호 변경</AdminButton>
        <AdminButton size="md">로그아웃</AdminButton>
      </div>
    </MyCard>
  );
}
