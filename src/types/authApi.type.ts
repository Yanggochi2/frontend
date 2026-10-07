// docs/API.md 인증·소속 (AUTH-01~05) 요청/응답 모양. 응답 필드는 명세 기준.
export type AccountStatus = string; // TODO: 백엔드 확정 후 결정 (UserSummary.accountStatus 열거값)

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  accountStatus: AccountStatus;
};

// AUTH-01. name 1~50자, password 8자 이상 영문+숫자, termsAgreed=true
export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  termsAgreed: boolean;
};

// AUTH-02. 토큰은 응답 쿠키(HttpOnly)로만 전달된다. 본문에 토큰이 없다.
export type LoginRequest = {
  email: string;
  password: string;
};
