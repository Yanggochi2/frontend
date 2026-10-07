// TODO(🔶 AUTH-00): 병동 코드 형식(길이)은 미확정. 예시 AB12CD34 기준 임시값.
export const WARD_CODE_MAX_LENGTH = 8;

// TODO(🔶 AUTH-00): 코드 입력 시도 횟수 제한은 미확정. 확정 전까지 UI에서 쓰지 않는다.
export const WARD_CODE_ATTEMPT_LIMIT: number | null = null;

export const STAFF_MIN = 0;
export const STAFF_MAX = 99;
