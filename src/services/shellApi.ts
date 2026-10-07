import { shellInfoMock } from "@/mocks/shell.mock";
import type { ShellInfo } from "@/types/shell.type";

// TODO: 백엔드 확정 후 실제 요청으로 교체 (주소는 환경 변수로 분리)
export async function getShellInfo(): Promise<ShellInfo> {
  return shellInfoMock;
}
