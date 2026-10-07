// docs/API.md 공통 규칙. 도메인별 모델은 각 xxx.type.ts에 둔다.
export type PageMeta = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ApiFieldError = { field: string; reason: string };

export type ApiErrorBody = {
  code: string;
  message: string;
  traceId?: string;
  fieldErrors?: ApiFieldError[];
};

export type ApiResult<T> = { data: T };
export type ApiListResult<T> = { data: T[]; meta: PageMeta };
