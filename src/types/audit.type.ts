export type AuditTone = "gray" | "blue" | "red";

export type AuditEntry = {
  id: string;
  occurredAt: string;
  actorName: string;
  actionLabel: string;
  actionTone: AuditTone;
  targetText: string;
  detailText: string;
};

export type AuditFilterChip = { key: string; label: string; active?: boolean; groupStart?: boolean };

export type AuditLogData = {
  filters: AuditFilterChip[];
  entries: AuditEntry[];
};
