export type SelectWardInfo = {
  codePlaceholder: string;
};

export type PendingInfo = {
  hospitalName: string;
  wardName: string;
  requestedAt: string;
};

export type ShiftKind = "D" | "E" | "N";

export type RulePreset = {
  id: string;
  label: string;
};

export type CreateWardDefaults = {
  requiredStaff: Record<ShiftKind, number>;
  presets: RulePreset[];
  defaultPresetId: string;
};

export type CreateWardInput = {
  hospitalName: string;
  wardName: string;
  requiredStaff: Record<ShiftKind, number>;
  rulePreset: string;
};
