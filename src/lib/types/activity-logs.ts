export interface ChangeValue<T = any> {
  oldValue: T;
  newValue?: T;
}

interface FileChanges {
  "file.id"?: ChangeValue<number>;
  "file.filename"?: ChangeValue<string>;
  "file.key"?: ChangeValue<string>;
  "file.fileUrl"?: ChangeValue<string>;
}

interface OutcomeChanges {
  "outcome.id"?: ChangeValue<number>;
  "outcome.name"?: ChangeValue<string>;
  "outcome.description"?: ChangeValue<string>;
}

export interface EvidenceChanges extends FileChanges, OutcomeChanges {
  description?: ChangeValue<string>;
  status?: ChangeValue<string>;
  createdAt?: ChangeValue<string>;
  updatedAt?: ChangeValue<string>;
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
  changes: EvidenceChanges;
  referenceId: string;
  createdAt: string;
  user: ActivityLogUser;
}

export type ActivityLogs = ActivityLog[];
