import { apiRequest } from "@/lib/apiClient";
import type { LoginRequest, SignupRequest, UserSummary } from "@/types/authApi.type";
import type { MeResponse } from "@/types/wardApi.type";

// 로그인·회원가입 화면(/login, /signup)에서 쓴다. Figma 시안은 아직 없다.
// 토큰은 서버가 내려주는 HttpOnly 쿠키로만 다룬다 (본문·저장소에 두지 않는다).

export async function signup(body: SignupRequest): Promise<UserSummary> {
  return apiRequest<UserSummary>("/auth/signup", { method: "POST", body });
}

export async function login(body: LoginRequest): Promise<UserSummary> {
  return apiRequest<UserSummary>("/auth/login", { method: "POST", body });
}

// TODO: 401 REFRESH_TOKEN_INVALID 후 처리(로그인 화면 이동)는 명세 (결정). 호출 시점도 미정.
export async function refreshSession(): Promise<void> {
  await apiRequest<void>("/auth/refresh", { method: "POST" });
}

export async function logout(): Promise<void> {
  await apiRequest<void>("/auth/logout", { method: "POST" });
}

// 로그인 직후 어디로 보낼지: 소속이 있으면 근무표, 없으면 소속 선택(초대 코드가 있으면 넘긴다).
// TODO: 승인 대기·반려 상태를 알 수 있는 API가 명세에 없다. 확정되면 /onboarding/pending 분기를 넣는다.
export async function getEntryPath(joinCode?: string): Promise<string> {
  const me = await apiRequest<MeResponse>("/me");
  if (me.membership && me.ward) return "/schedule";
  return joinCode ? `/onboarding/select-ward?code=${encodeURIComponent(joinCode)}` : "/onboarding/select-ward";
}
