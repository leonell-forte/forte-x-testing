import { z } from "zod";

import { evidence, updateStatusSchema } from "../validators/evidence";
import { File, SortValues, User } from "./common";
import { EvidenceStatus, MILESTONE_TYPES } from "./milestones";

export type EvidenceFieldValues = z.infer<typeof evidence.schema> & {
  beneficiaryId: string;
};

export enum UpdateEvidenceStatusEnum {
  APPROVE = "approved",
  REJECT = "rejected",
  MORE_INFO = "more information requested",
}

export type AddEvidenceParams = {
  beneficiaryId?: number;

  projectId?: number;

  contractId?: number;

  milestoneId?: string;

  values: EvidenceFieldValues;
};

export type Evidence = {
  id: number;

  description: string;

  status: EvidenceStatus;

  file: File;

  createdAt: string;

  createdBy: User;

  updatedBy: User;

  beneficiaryId?: number;
};

export type DeleteParams = {
  beneficiaryId: number;
  evidenceId: number;
};

export type UpdateStatusFieldValues = z.infer<typeof updateStatusSchema>;

export enum EvidenceSortLabel {
  CREATED_AT = `"evidence"."createdAt"`,
  NAME = `"beneficiary"."firstName"`,
  OUTCOME = `"outcome"`,
  FILENAME = `"filename"`,
}

export interface IEvidenceFilters {
  status?: EvidenceStatus | string;
  type?: string;
  sortLabel?: EvidenceSortLabel;
  sortValue: SortValues;
}

export type MainEvidence = {
  id: number;
  filename: File;
  beneficiary: User;
  milestoneId?: string;
  type?: keyof typeof MILESTONE_TYPES;
  status: EvidenceStatus;
  outcome?: string;
};
