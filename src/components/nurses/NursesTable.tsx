import RnChip from "@/components/ui/RnChip";
import { DUTY_ROLE_LABEL, NURSE_ROLE_LABEL, NURSE_STATUS_LABEL } from "@/constants/nurses.constants";
import type { Nurse } from "@/types/nurses.type";

const HEADERS = ["이름", "권한", "듀티 역할", "상태", "경력", "숙련도", "소속 기간", ""];
const cell = "h-[72px] whitespace-nowrap pr-3 pl-5 text-left align-middle";
const text = "text-[17px] font-medium text-ink-sub";

export default function NursesTable({ items }: { items: Nurse[] }) {
  return (
    <div className="w-full overflow-x-auto rounded-[16px] border border-line bg-white">
      <table className="w-full min-w-[1100px] border-collapse">
        <thead>
          <tr className="bg-surface">
            {HEADERS.map((h, i) => (
              <th
                key={i}
                scope="col"
                className={`h-[52px] whitespace-nowrap pr-3 pl-5 text-left text-[16px] font-bold text-ink-sub ${
                  i === 0 ? "sticky left-0 z-10 w-[150px] bg-surface" : ""
                }`}
              >
                {h || <span className="sr-only">관리</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((n) => (
            <tr key={n.id} className="border-b border-surface bg-white">
              <th scope="row" className={`${cell} sticky left-0 z-10 w-[150px] bg-white text-[17px] font-bold text-ink`}>
                {n.name}
              </th>
              <td className={`${cell} w-[130px]`}>
                <RnChip tone={n.role === "HEAD_NURSE" ? "brand" : "gray"}>{NURSE_ROLE_LABEL[n.role]}</RnChip>
              </td>
              <td className={`${cell} w-[150px]`}>
                {n.dutyRole ? (
                  <RnChip tone={n.dutyRole === "CHARGE" ? "brand" : n.dutyRole === "NEW" ? "danger" : "gray"}>
                    {DUTY_ROLE_LABEL[n.dutyRole]}
                  </RnChip>
                ) : (
                  "-"
                )}
              </td>
              <td className={`${cell} w-[120px]`}>
                {n.status ? <RnChip>{NURSE_STATUS_LABEL[n.status]}</RnChip> : "-"}
              </td>
              <td className={`${cell} w-[130px] ${text}`}>{n.careerYears === undefined ? "-" : `${n.careerYears}년 ${n.careerMonths ?? 0}개월`}</td>
              <td className={`${cell} w-[110px] ${text}`}>{n.skill ?? "-"}</td>
              <td className={`${cell} w-[260px] ${text}`}>{n.periodLabel ?? "-"}</td>
              <td className={`${cell} ${text}`}>
                {/* TODO: 간호사 정보 수정(NUR-04) 화면은 미제작 */}
                수정
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
