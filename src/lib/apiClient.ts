import type { ApiErrorBody, ApiListResult, ApiResult } from "@/types/api.type";

// 호출 주소는 환경 변수로 분리한다. 예: https://example.com/api/v1
// 비어 있으면 모든 요청이 API_NOT_CONFIGURED ApiError로 실패한다.
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly traceId?: string;
  readonly fieldErrors: ApiErrorBody["fieldErrors"];

  constructor(status: number, body: Partial<ApiErrorBody>) {
    super(body.message ?? "요청에 실패했어요.");
    this.name = "ApiError";
    this.status = status;
    this.code = body.code ?? "INTERNAL_ERROR";
    this.traceId = body.traceId;
    this.fieldErrors = body.fieldErrors;
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  query?: Query;
  body?: unknown;
  // 중복 실행 위험이 있는 POST(생성, 승인, 확정, 자동 생성 시작 등)에 넘긴다.
  idempotencyKey?: string;
  // 근무표 편집 잠금을 쓰는 변경 요청에 넘긴다.
  scheduleLockToken?: string;
};

function buildUrl(path: string, query?: Query) {
  const url = new URL(`${BASE_URL}${path}`, "http://placeholder.local");
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  });
  const search = url.search;
  return `${BASE_URL}${path}${search}`;
}

// TODO: X-CSRF-Token을 어디서 받는지 API 명세에 없다. 백엔드 확정 후 이 함수만 바꾼다.
function getCsrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|; )csrfToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

// 서버 컴포넌트에서 부르면 브라우저가 보낸 쿠키(HttpOnly 인증 쿠키)를 그대로 넘긴다.
async function serverCookieHeader(): Promise<string | undefined> {
  if (typeof window !== "undefined") return undefined;
  const { cookies } = await import("next/headers");
  const all = (await cookies()).getAll();
  return all.length ? all.map((c) => `${c.name}=${c.value}`).join("; ") : undefined;
}

async function send(path: string, options: RequestOptions): Promise<Response> {
  const method = options.method ?? "GET";
  const headers: Record<string, string> = { Accept: "application/json" };

  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET") {
    const csrf = getCsrfToken();
    if (csrf) headers["X-CSRF-Token"] = csrf;
  }
  if (options.idempotencyKey) headers["Idempotency-Key"] = options.idempotencyKey;
  if (options.scheduleLockToken) headers["X-Schedule-Lock-Token"] = options.scheduleLockToken;
  // 쿠키를 먼저 읽어 서버 렌더링 시 항상 요청마다 렌더링되게 한다 (빌드 시점에 결과가 고정되지 않도록).
  const cookie = await serverCookieHeader();
  if (cookie) headers.Cookie = cookie;

  if (BASE_URL === "") {
    throw new ApiError(0, { code: "API_NOT_CONFIGURED", message: "서버 주소가 설정되지 않았어요." });
  }

  const response = await fetch(buildUrl(path, options.query), {
    method,
    headers,
    credentials: "include",
    cache: "no-store",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let body: { error?: Partial<ApiErrorBody> } = {};
    try {
      body = await response.json();
    } catch {}
    throw new ApiError(response.status, body.error ?? {});
  }
  return response;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await send(path, options);
  if (response.status === 204) return undefined as T;
  return ((await response.json()) as ApiResult<T>).data;
}

export async function apiRequestList<T>(path: string, options: RequestOptions = {}): Promise<ApiListResult<T>> {
  const response = await send(path, options);
  return (await response.json()) as ApiListResult<T>;
}

// 엑셀 내보내기처럼 파일을 받는 요청
export async function apiRequestBlob(path: string, options: RequestOptions = {}): Promise<Blob> {
  return (await send(path, options)).blob();
}
