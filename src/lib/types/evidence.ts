import { z } from "zod";

import { evidence } from "../validators/evidence";
import { File, User } from "./common";
import { EvidenceStatus } from "./milestones";

export type EvidenceFieldValues = z.infer<typeof evidence.schema> & {
  beneficiaryId: string;
};

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
