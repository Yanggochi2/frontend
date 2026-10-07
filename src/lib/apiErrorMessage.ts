import { ApiError } from "@/lib/apiClient";

// 오류 코드(docs/API.md)를 사용자에게 보여 줄 한국어 문구로 바꾼다. 코드별 문구가 없으면 fallback.
const MESSAGES: Record<string, string> = {
  API_NOT_CONFIGURED: "서버에 연결하지 못했어요. 서버 주소를 확인해 주세요.",
  UNAUTHENTICATED: "로그인이 필요해요.",
  VALIDATION_ERROR: "입력한 내용을 다시 확인해 주세요.",
  INVALID_CREDENTIALS: "이메일 또는 비밀번호가 맞지 않아요.",
  ACCOUNT_DISABLED: "사용할 수 없는 계정이에요. 병동 수간호사에게 문의해 주세요.",
  EMAIL_ALREADY_EXISTS: "이미 가입한 이메일이에요. 로그인해 주세요.",
  FORBIDDEN: "이 작업을 할 권한이 없어요.",
  RESOURCE_NOT_FOUND: "대상을 찾을 수 없어요.",
  RATE_LIMITED: "시도가 너무 많아요. 잠시 후에 다시 해 주세요.",
  JOIN_CODE_NOT_FOUND: "병동 코드를 찾을 수 없어요. 코드를 다시 확인해 주세요.",
  REQUEST_ALREADY_EXISTS: "이미 가입을 신청했어요. 승인을 기다려 주세요.",
  MEMBERSHIP_ALREADY_EXISTS: "이미 소속된 병동이 있어요.",
  INVALID_STAFFING: "하루 필요 인원을 다시 확인해 주세요.",
  REQUEST_ALREADY_PROCESSED: "이미 처리된 신청이에요.",
  REASON_REQUIRED: "반려 사유를 입력해 주세요.",
  ROTATION_IN_PROGRESS: "코드를 새로 만드는 중이에요. 잠시 후에 다시 해 주세요.",
  ROLE_ALREADY_ASSIGNED: "이미 수간호사예요.",
  LAST_HEAD_NURSE_CONFLICT: "마지막 수간호사는 바꿀 수 없어요.",
  PUSH_NOT_SUPPORTED: "이 브라우저에서는 웹 푸시를 쓸 수 없어요.",
  INTERNAL_ERROR: "서버에 문제가 생겼어요. 잠시 후에 다시 해 주세요.",
};

export function toErrorMessage(error: unknown, fallback = "요청에 실패했어요. 잠시 후에 다시 해 주세요."): string {
  if (error instanceof ApiError) {
    const first = error.fieldErrors?.[0];
    return MESSAGES[error.code] ?? first?.reason ?? fallback;
  }
  return fallback;
}
