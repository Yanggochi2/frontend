"use client";

import { useState } from "react";
import type { NotificationSetting } from "@/types/me.type";
import MyCard from "./MyCard";

// TODO: 저장은 백엔드 연동 후 (지금은 화면 안에서만 켜고 끈다)
export default function NotificationToggles({ items }: { items: NotificationSetting[] }) {
  const [state, setState] = useState(() => Object.fromEntries(items.map((i) => [i.id, i.enabled])));

  return (
    <MyCard title="알림 설정">
      {items.map((item) => {
        const on = state[item.id];
        return (
          <div key={item.id} className="flex w-full items-center gap-3 py-1">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[18px] leading-normal font-bold text-ink">{item.title}</p>
              <p className="text-[16px] leading-normal font-medium text-ink-sub">{item.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label={item.title}
              onClick={() => setState((s) => ({ ...s, [item.id]: !s[item.id] }))}
              className={`flex h-8 w-14 shrink-0 items-center rounded-full px-1 ${
                on ? "justify-end bg-brand" : "justify-start bg-[#d1d6db]"
              }`}
            >
              <span className="size-6 rounded-full bg-white" />
            </button>
          </div>
        );
      })}
    </MyCard>
  );
}
