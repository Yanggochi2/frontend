import type { LandingRow } from "@/constants/landing.constants";

const TAG_TONE = {
  bad: "bg-[rgb(255_59_78/0.22)] text-[#ffb1b9]",
  ok: "bg-[rgb(240_169_189/0.2)] text-landing-blush",
  plain: "bg-white/10 text-landing-frost",
} as const;

export default function LandingPanel({ rows, className = "" }: { rows: LandingRow[]; className?: string }) {
  return (
    <div
      className={`max-w-[520px] overflow-hidden rounded-[22px] border border-landing-line bg-landing-panel backdrop-blur-[18px] ${className}`}
    >
      {rows.map((row, i) => (
        <div
          key={row.title}
          className={`flex items-center justify-between gap-4 px-[22px] py-4 ${i > 0 ? "border-t border-landing-line" : ""}`}
        >
          <div>
            <strong className="block text-[16px] font-bold text-white">{row.title}</strong>
            <small className="block text-[14px] text-landing-mist">{row.sub}</small>
          </div>
          {row.tag ? (
            <span className={`flex-none rounded-full px-[13px] py-[5px] text-[14px] font-bold ${TAG_TONE[row.tag.tone]}`}>
              {row.tag.label}
            </span>
          ) : (
            <small className="text-[14px] text-landing-mist">{row.time}</small>
          )}
        </div>
      ))}
    </div>
  );
}
