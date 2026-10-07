// 근무표 화면의 미확정(🔶) 값을 한곳에 모은다. (AGENTS.md 6.3)

// TODO(🔶 자동 생성 최대 시간): 확정 전 임시 값. 화면 문구 "보통 1분 안에 끝나요"에 쓴다.
export const GENERATE_ESTIMATED_MINUTES = 1;

// TODO(🔶 진행률 갱신 방식 폴링/SSE): 지금은 mock 고정 값을 보여 준다.
export const GENERATE_PROGRESS_REFRESH = "mock-static" as const;

// TODO(🔶 ED 교육 듀티): 미확정이라 브러시·팝오버에 넣지 않는다.
