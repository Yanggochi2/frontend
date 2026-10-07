import { STAFF_MAX, STAFF_MIN } from "./onboarding.constants";

type Props = {
  label: string;
  value: number;
  onChange: (next: number) => void;
};

const stepBtn =
  "flex size-11 cursor-pointer items-center justify-center rounded-lg text-lg text-ink-sub disabled:opacity-40";

export default function StaffStepper({ label, value, onChange }: Props) {
  return (
    <div className="flex h-14 items-center gap-3.5 rounded-[14px] bg-surface pr-2 pl-[18px] font-bold">
      <span className="text-lg text-ink-sub">{label}</span>
      <output className="flex-1 text-xl text-ink" aria-label={`${label} 필요 인원`}>
        {value}
      </output>
      <button
        type="button"
        className={stepBtn}
        aria-label={`${label} 인원 줄이기`}
        disabled={value <= STAFF_MIN}
        onClick={() => onChange(value - 1)}
      >
        －
      </button>
      <button
        type="button"
        className={stepBtn}
        aria-label={`${label} 인원 늘리기`}
        disabled={value >= STAFF_MAX}
        onClick={() => onChange(value + 1)}
      >
        ＋
      </button>
    </div>
  );
}
