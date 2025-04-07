import { File } from "./common";

export type MilestoneStatus = "achieved" | "paid" | "open" | "invoiced";

export type EvidenceStatus =
  | "accepted"
  | "pending review"
  | "more information requested"
  | "invoiced"
  | "rejected"
  | "paid";

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
  invoicedAt: string;
  outcome: Sub;
  paidAt: string;
  achievedAt: string;
  provider: Sub;
  reference: Sub;
  status: MilestoneStatus;
  type: keyof typeof MILESTONE_TYPES;
  updatedAt: string;
  evidences: TMilestoneEvidence[];
}

export interface IMilestoneFilters {
  status?: MilestoneStatus | string;
  contractId?: string;
  type?: string;
}
