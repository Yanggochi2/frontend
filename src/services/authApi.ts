import { apiRequest } from "@/lib/apiClient";
import type { LoginRequest, SignupRequest, UserSummary } from "@/types/authApi.type";

// TODO: Figma에 로그인/가입 화면이 없어 화면은 만들지 않았다. 디자인 확정 후 이 함수들을 연결한다.
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
