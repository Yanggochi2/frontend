# Router (초안)

> Figma 화면 이름 기준으로 새로 정한 경로다. 경로 이름은 추측이며 팀 확정 시 수정한다.

## 사이드바 있음 — `src/app/(app)/`
| 경로 | 화면 | Figma 프레임 |
|---|---|---|
| `/schedule` | 근무표 시트 | v3.1-A, 근무표 시트 · 빈 표, 빈 상태 · 근무표 |
| `/schedule/generate` | 자동 생성 진행 | 자동 생성 진행 |
| `/schedule/generate/failed` | 생성 실패 · 해 없음 | 생성 실패 · 해 없음 |
| `/requests` | 신청 관리 | 신청 관리, 빈 상태 · 신청 관리 |
| `/requests/new` | 새 신청 | 새 신청 |
| `/nurses` | 간호사 명단 | 간호사 명단, 빈 상태 · 간호사 명단 |
| `/nurses/new` | 간호사 등록 | 간호사 등록 |
| `/rules` | 규칙 설정 | 규칙 설정 |
| `/stats` | 통계·공정성 | 통계·공정성, 빈 상태 · 통계·공정성 |
| `/approvals` | 가입 승인 | 가입 승인, 빈 상태 · 가입 승인 |
| `/audit-log` | 감사 로그 | 감사 로그, 빈 상태 · 감사 로그 |
| `/ward-settings` | 병동 설정 | 병동 설정 |
| `/me` | 마이페이지 (수간호사 / 일반 간호사) | 마이페이지 두 가지 |

월별 보기(`월별 보기 · 사이드바 열림`)는 별도 경로 없이 `/schedule?view=month`(주간/월간 보기 전환)로 둔다.
일반 간호사 근무표(확정 전)는 `/schedule`에서 역할에 따라 분기 (추측, 역할 판정은 서버). 지금은 미리보기용으로 `?role=nurse`를 쓴다 (TODO, 서버 판정으로 교체).
`/schedule` 미리보기 쿼리(임시): `state=empty`(간호사 없음), `state=unassigned`(빈 표), `state=error`, `view=month`.

## 사이드바 없음 — `src/app/(onboarding)/`
| 경로 | 화면 |
|---|---|
| `/onboarding/select-ward` | 첫 화면 · 소속 선택 |
| `/onboarding/pending` | 첫 화면 · 승인 대기 |
| `/onboarding/create-ward` | 첫 화면 · 병동 개설 |

## 진입
- `/` → `/schedule` 임시 redirect. 접근 상태별 분기(로그인, 소속 없음, 미승인)는 백엔드 확정 후 (TODO).
