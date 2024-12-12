import { z } from "zod";
import { evidence } from "../validators/evidence";

export type EvidenceFieldValues = z.infer<typeof evidence.schema>;

export type AddEvidenceParams = {
  beneficiaryId: number;

  projectId: number;

  contractId: number;

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

  file: {
    id: number;

    filename: string;

    key: string;

    fileUrl: string;
  };

  createdAt: string;

  createdBy: {
    id: number;

    firstName: string;

    lastName: string;
  };

  updatedBy: {
    id: number;

    firstName: string;

    lastName: string;
  };
};
