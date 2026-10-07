import type { InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

export default function OnboardingInput(props: Props) {
  return (
    <input
      type="text"
      className="h-14 w-full rounded-[14px] bg-surface px-5 text-lg font-medium text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-primary"
      {...props}
    />
  );
}
