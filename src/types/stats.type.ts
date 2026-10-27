export type FairnessRow = {
  id: string;
  name: string;
  dayCount: number;
  eveningCount: number;
  nightCount: number;
  offCount: number;
  offTarget: number;
  offCarry: number;
  weekendCount: number;
  holidayCount: number;
};

export type StatsData = {
  periodLabel: string;
  rows: FairnessRow[];
};
