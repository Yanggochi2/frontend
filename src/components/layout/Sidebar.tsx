"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, useNavModel, type NavItem } from "@/hooks/useNavModel";
import type { ShellInfo } from "@/types/shell.type";

function NavList({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const active = isNavActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex h-[52px] w-full shrink-0 items-center gap-2 rounded-[12px] pr-[14px] pl-4 text-[18px] ${
              active
                ? "bg-primary-soft font-bold text-primary"
                : "font-medium text-ink-sub"
            }`}
          >
            <span className="min-w-0 flex-1">{item.label}</span>
            {item.badge ? (
              <span className="rounded-[12px] bg-danger px-[9px] py-0.5 text-[14px] font-bold text-white">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </>
  );
}

export default function Sidebar({ shell, onClose }: { shell: ShellInfo; onClose: () => void }) {
  const nav = useNavModel(shell);

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col gap-1.5 overflow-y-auto border border-line bg-sidebar px-4 pt-6 pb-5">
      <div className="flex items-center justify-between">
        <p className="text-[22px] font-bold text-ink">Ottugi</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="사이드바 닫기"
          className="flex size-10 items-center justify-center rounded-[12px] bg-surface text-[20px] font-bold text-ink-sub"
        >
          «
        </button>
      </div>
      <div className="flex w-full flex-col gap-0.5 rounded-[14px] border border-line bg-white px-[14px] py-3">
        <p className="text-[14px] font-medium text-ink-mute">{shell.hospitalName}</p>
        <p className="text-[18px] font-bold text-ink">{shell.wardName}</p>
      </div>
      <div className="h-2 shrink-0" />
      <NavList items={nav.mainItems} />
      {nav.adminItems.length > 0 ? (
        <>
          <div className="h-px w-full shrink-0 bg-line" />
          <NavList items={nav.adminItems} />
        </>
      ) : null}
      <div className="min-h-px flex-1" />
      <Link
        href={nav.profileHref}
        className="flex w-full flex-col gap-0.5 rounded-[14px] border border-line bg-white px-[14px] py-3"
      >
        <p className="text-[17px] font-bold text-ink">{nav.userName}</p>
        <p className="text-[14px] font-medium text-ink-mute">
          {nav.role === "HEAD_NURSE" ? "수간호사" : "간호사"}
        </p>
      </Link>
    </aside>
  );
}
