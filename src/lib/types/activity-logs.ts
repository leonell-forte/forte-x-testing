export interface ChangeValue<T = any> {
  oldValue: T;
  newValue?: T;
}

export interface EvidenceChanges {
  propertyName: string;
  oldValue: string | number;
  newValue: string | number;
}

interface ActivityLogUser {
  id: number;
  firstName: string;
  lastName: string;
}

export interface ActivityLog {
  id: number;
  module: "evidences";
  action: string;
  changes: EvidenceChanges[];
  referenceId: string;
  createdAt: string;
  user: ActivityLogUser;
}

export type ActivityLogs = ActivityLog[];
