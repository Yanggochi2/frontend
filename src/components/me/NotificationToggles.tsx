"use client";

import { useState } from "react";
import { toErrorMessage } from "@/lib/apiErrorMessage";
import { updateNotificationSetting } from "@/services/meApi";
import type { NotificationSetting } from "@/types/me.type";
import MyCard from "./MyCard";

export default function NotificationToggles({ items }: { items: NotificationSetting[] }) {
  const [state, setState] = useState(() => Object.fromEntries(items.map((i) => [i.id, i.enabled])));

  const [error, setError] = useState<string | null>(null);

  async function toggle(id: string) {
    const next = !state[id];
    setState((s) => ({ ...s, [id]: next }));
    setError(null);
    try {
      await updateNotificationSetting(id, next);
    } catch (e) {
      setState((s) => ({ ...s, [id]: !next }));
      setError(toErrorMessage(e));
    }
  }

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
              onClick={() => toggle(item.id)}
              className={`flex h-8 w-14 shrink-0 items-center rounded-full px-1 ${
                on ? "justify-end bg-brand" : "justify-start bg-[#d1d6db]"
              }`}
            >
              <span className="size-6 rounded-full bg-white" />
            </button>
          </div>
        );
      })}
      {error ? <p role="alert" className="text-[16px] font-medium text-danger">{error}</p> : null}
    </MyCard>
  );
}
