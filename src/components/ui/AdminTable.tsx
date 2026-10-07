import type { ReactNode } from "react";

// 표는 자기 컨테이너 안에서만 가로 스크롤하고 첫 열은 sticky
export function AdminTableShell({
  minWidth,
  children,
}: {
  minWidth: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-line bg-white">
      <table className={`w-full border-collapse ${minWidth}`}>{children}</table>
    </div>
  );
}

export function AdminTh({
  first = false,
  className = "",
  children,
}: {
  first?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <th
      scope="col"
      className={`h-[52px] bg-surface pr-3 pl-5 text-left text-[16px] font-bold whitespace-nowrap text-ink-sub ${
        first ? "sticky left-0 z-10" : ""
      } ${className}`}
    >
      {children}
    </th>
  );
}

export function AdminTr({ children }: { children: ReactNode }) {
  return <tr className="border-b border-surface last:border-b">{children}</tr>;
}

export function AdminTd({
  first = false,
  className = "",
  children,
}: {
  first?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <td
      className={`h-[72px] pr-3 pl-5 text-[17px] whitespace-nowrap ${
        first ? "sticky left-0 z-10 bg-white font-bold text-ink" : "font-medium text-ink-sub"
      } ${className}`}
    >
      {children}
    </td>
  );
}
