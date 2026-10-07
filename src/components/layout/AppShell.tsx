"use client";

import { useSyncExternalStore } from "react";
import type { ShellInfo } from "@/types/shell.type";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

const STORAGE_KEY = "ottugi.sidebar";

// 사이드바 열림/닫힘. 닫으면 상단 메뉴로 바뀐다. 선택은 이 브라우저에만 기억한다.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readClosed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "closed";
  } catch {
    return false;
  }
}

export default function AppShell({ shell, children }: { shell: ShellInfo; children: React.ReactNode }) {
  const closed = useSyncExternalStore(subscribe, readClosed, () => false);
  const open = !closed;

  function change(next: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, next ? "open" : "closed");
    } catch {}
    listeners.forEach((l) => l());
  }

  return open ? (
    <div className="flex h-screen-ui">
      <Sidebar shell={shell} onClose={() => change(false)} />
      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  ) : (
    <div className="flex h-screen-ui flex-col">
      <TopNav shell={shell} onOpen={() => change(true)} />
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
