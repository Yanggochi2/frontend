"use client";

import { useSearchParams } from "next/navigation";
import type { Role, ShellInfo } from "@/types/shell.type";

export type NavItem = {
  label: string;
  href: string;
  badge?: number;
  exact?: boolean;
};

export type NavModel = {
  role: Role;
  userName: string;
  profileHref: string;
  mainItems: NavItem[];
  adminItems: NavItem[];
};

// 사이드바와 상단 메뉴(사이드바 닫힘)가 같은 메뉴를 쓴다.
// TODO: 역할은 서버가 세션에서 판정한다. `?role=nurse`는 일반 간호사 화면 미리보기용 임시 스위치.
export function useNavModel(shell: ShellInfo): NavModel {
  const role: Role = useSearchParams().get("role") === "nurse" ? "NURSE" : shell.role;

  const mainItems: NavItem[] =
    role === "NURSE"
      ? [
          { label: "근무표", href: "/schedule", exact: true },
          { label: "내 신청", href: "/requests" },
          { label: "내 통계", href: "/stats" },
        ]
      : [
          { label: "근무표", href: "/schedule", exact: true },
          { label: "자동 생성", href: "/schedule/generate" },
          { label: "신청 관리", href: "/requests", badge: shell.pendingRequestCount },
          { label: "간호사 명단", href: "/nurses" },
          { label: "규칙 설정", href: "/rules" },
          { label: "통계·공정성", href: "/stats" },
        ];
  const adminItems: NavItem[] =
    role === "NURSE"
      ? []
      : [
          { label: "가입 승인", href: "/approvals", badge: shell.pendingApprovalCount },
          { label: "감사 로그", href: "/audit-log" },
          { label: "병동 설정", href: "/ward-settings" },
        ];

  return {
    role,
    userName: role === "NURSE" ? "박지우" : shell.userName,
    profileHref: role === "NURSE" ? "/me?role=nurse" : "/me",
    mainItems,
    adminItems,
  };
}

export function isNavActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
