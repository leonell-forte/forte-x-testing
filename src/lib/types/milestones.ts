import { File } from "./common";

export type StatusType = "DRAFT" | "SIGNED" | "COMPLETED" | "CANCELLED" | "";

export type StatusRecords = Exclude<StatusType, "CANCELLED" | "">;

export type MilestoneStatus = "Achieved" | "Paid" | "Open";

export type EvidenceStatus =
  | "Accepted"
  | "Pending Review"
  | "More Information Requested"
  | "Invoiced"
  | "Rejected"
  | "Paid";

export const MILESTONE_TYPES = {
  threshold: "Threshold",
  outcome: "Per outcome",
};

type Sub = {
  id?: string;
  name?: string;
};

export type TMilestoneEvidence = {
  id: number;
  description: string;
  status: EvidenceStatus;
  file: File;
  beneficiary: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
};

export interface IMilestone {
  id: string;
  contract: Sub;
  createdAt: string;
  cost: string;
  funder: Sub;
  invoicedAt?: string;
  outcome: Sub;
  paidAt?: string;
  provider: Sub;
  reference: Sub;
  status: MilestoneStatus;
  type: keyof typeof MILESTONE_TYPES;
  updatedAt: string;
  evidences: TMilestoneEvidence[];
}

export interface IMilestoneFilters {
  status?: StatusType | string;
  contractId?: string;
}
