// 근무표 화면의 미확정(🔶) 값을 한곳에 모은다. (AGENTS.md 6.3)

// TODO(🔶 자동 생성 최대 시간): 확정 전 임시 값. 화면 문구 "보통 1분 안에 끝나요"에 쓴다.
export const GENERATE_ESTIMATED_MINUTES = 1;
// TODO(🔶 자동 생성 최대 시간): 서버 상한 이내에서 요청하는 값. 임시 60초
export const GENERATE_MAX_SECONDS = 60;
// TODO(🔶 진행률 갱신 방식): 폴링으로 둔다. API 명세 D-12 권장값 2초
export const GENERATION_POLL_MS = 2000;
// TODO(🔶 GEN-02 stage 형식): 백엔드가 주는 stage 값 기준으로 단계 카드를 만든다. 모르는 값은 진행 중으로 본다
export const GENERATION_STAGES: { stage: string; title: string }[] = [
  { stage: "QUEUED", title: "준비" },
  { stage: "OPTIMIZING", title: "근무 배치" },
  { stage: "COMPLETED", title: "완료" },
];


// TODO(🔶 ED 교육 듀티): 미확정이라 브러시·팝오버에 넣지 않는다.
