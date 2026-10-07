// 화면 상태 미리보기용 (임시, 백엔드 연결 시 제거) — Architecture.md 참고
export type PreviewState = "empty" | "error" | "loading";

export function toPreviewState(value: string | string[] | undefined): PreviewState | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v === "empty" || v === "error" || v === "loading" ? v : undefined;
}
