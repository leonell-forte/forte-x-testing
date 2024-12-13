import { z } from "zod";

import { evidence } from "../validators/evidence";
import { File, User } from "./common";

export type EvidenceFieldValues = z.infer<typeof evidence.schema>;

export type AddEvidenceParams = {
  beneficiaryId?: number;

  projectId?: number;

  contractId?: number;

  values: EvidenceFieldValues;
};

export type Evidence = {
  id: number;

  description: string;

  status: string;

  outcome: {
    id: number;

    name: string;

    description: string;
  };

  file: File;

  createdAt: string;

  createdBy: User;

  updatedBy: User;

  beneficiaryId?: number;
};
