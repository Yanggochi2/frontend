# Architecture (초안)

> 이 문서는 프로젝트 세팅 시 새로 작성한 초안이다. 확정이 아닌 부분은 "추측"으로 표시했다.

## 스택
- Next.js (App Router, `src/` 사용) + TypeScript + Tailwind CSS v4
- 폰트: Noto Sans KR (500 / 700), `next/font/google`로 로드
- 상태 관리 라이브러리 없음. local state 우선.

## 폴더 구조
```
src/
  app/                 라우트(page, layout만). 조립만 한다.
    (app)/             사이드바 있는 화면
    (onboarding)/      사이드바 없는 처음 가입 화면
  components/
    layout/            Sidebar 등 공통 레이아웃
    ui/                공용 UI (Button, Chip, DutyChip 등)
    <feature>/         화면별 컴포넌트 (schedule, requests, nurses ...)
  constants/           🔶 미확정 값 모음 (xxx.constants.ts, `TODO(🔶 <명세 ID>)` 표시)
  hooks/               useXxx
  services/            요청 함수 (xxxApi.ts). 지금은 mock을 반환한다.
  mocks/               mock 데이터 (xxx.mock.ts). services에서만 import한다.
  types/               xxx.type.ts
```

## 책임
- **page**: 서비스 호출, loading/error/empty 분기, feature 컴포넌트 조립.
- **component**: 하나의 역할. 데이터는 props로 받는다. mock을 직접 import하지 않는다.
- **service**: 요청 함수. 지금은 mock을 반환. 백엔드 연결 시 이 파일만 바꾼다.
- **mock**: `*.mock.ts`. 응답 형태는 명세서를 따르고 불확실한 필드는 `TODO`.

## 화면 상태 미리보기 (임시)
loading / error / empty 화면 확인용으로 services의 mock 함수가 `state` 값을 받을 수 있다.
page는 `searchParams.state`(`empty` | `error` | `loading`)를 서비스에 넘긴다. 개발 확인용이며 백엔드 연결 시 제거한다.

## 화면 범위
- **웹(데스크톱) 전용**이다. 반응형은 하지 않는다. 기준은 화면 캡처(1680px, 사이드바 열림).
- 사이드바 240px 고정, 본문은 `max-w-*`로 가운데 정렬. 표·시트는 자기 컨테이너 안에서 가로 스크롤하고 첫 열은 sticky.
- 모바일/태블릿은 지원하지 않으므로 `sm:`, `md:`, `lg:` 같은 반응형 접두사를 쓰지 않는다.

## 디자인 토큰
`src/app/globals.css`의 `@theme`에 모았다. 값은 Figma 라이트 화면 기준이며 `docs/design-system.md`와 다른 부분은 Figma를 따랐다.
(예: 포인트 컬러 #a65468, 근무 종류별 칩 색)

## 역할 미리보기 (임시)
역할은 서버가 판정한다. 백엔드 전에는 `?role=nurse`로 일반 간호사 화면(사이드바, 근무표, 마이페이지)을 미리 본다. 백엔드 연결 시 제거한다.

## 근무표·자동 생성 서비스
- `services/scheduleApi.ts`(조회·셀 변경·확정·내보내기), `services/generationApi.ts`(자동 생성 GEN-01~05). `NEXT_PUBLIC_API_BASE_URL`이 있으면 실제 API, 없으면 mock.
- 타입: `types/scheduleApi.type.ts`(API 모델), `types/schedule.type.ts`(화면용). 매핑은 scheduleApi.ts에서 한다.
- `ScheduleSheet`는 셀 변경 시 화면을 먼저 바꾸고 `patchScheduleCells`로 저장한다(실패 시 되돌림, Undo 스택은 클라이언트 메모리). 연차(AL)는 표시만 하고 직접 입력하지 않는다.
- 자동 생성 화면은 `?jobId=`로 작업을 지정한다 (TODO: 라우팅 확정 후 결정).
