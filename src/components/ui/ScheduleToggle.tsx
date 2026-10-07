type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export default function ScheduleToggle({ checked, onChange, label }: Props) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[16px] font-medium text-ink-sub">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-line"}`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-all ${checked ? "left-[18px]" : "left-0.5"}`}
        />
      </button>
      <span>{label}</span>
    </label>
  );
}
