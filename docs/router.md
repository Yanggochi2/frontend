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
일반 간호사 근무표(확정 전)는 `/schedule`에서 서버 응답(역할, 확정본 유무)에 따라 분기한다 (추측, 역할 판정은 서버). 쿼리는 `view=month`만 쓴다.

## 사이드바 없음 — `src/app/(onboarding)/`
| 경로 | 화면 |
|---|---|
| `/onboarding/select-ward` | 첫 화면 · 소속 선택 |
| `/onboarding/pending` | 첫 화면 · 승인 대기 |
| `/onboarding/create-ward` | 첫 화면 · 병동 개설 |

## 로그인·회원가입 — `src/app/(auth)/`
| 경로 | 화면 |
|---|---|
| `/login` | 로그인. 성공하면 `GET /me`로 소속이 있으면 `/schedule`, 없으면 `/onboarding/select-ward` |
| `/signup` | 회원가입. 가입 후 바로 로그인하고 소속 선택으로 간다 |

- 병동 초대 링크는 `/signup?code=XXXX`. 코드는 로그인·가입을 거쳐 `/onboarding/select-ward?code=XXXX`로 넘어가 입력칸에 미리 채워진다.
- 앱 화면에서 `/me`가 401이면 `/login`으로 보낸다. 로그아웃 후에도 `/login`.

## 진입
- `/` → `/schedule` 임시 redirect. 접근 상태별 분기(로그인, 소속 없음, 미승인)는 백엔드 확정 후 (TODO).
