export type Role = "HEAD_NURSE" | "NURSE";

export type ShellInfo = {
  hospitalName: string;
  wardName: string;
  userName: string;
  role: Role;
  pendingRequestCount: number;
  pendingApprovalCount: number;
};
