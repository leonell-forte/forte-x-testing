import { z } from "zod";

import { evidence, updateStatusSchema } from "../validators/evidence";
import { File, User } from "./common";
import { EvidenceStatus } from "./milestones";

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
