import { z } from "zod";
import { evidence } from "../validators/evidence";

export type EvidenceFieldValues = z.infer<typeof evidence.schema>;

export type AddEvidenceParams = {
  beneficiaryId: number;

  projectId: number;

  contractId: number;

  values: EvidenceFieldValues;
};
