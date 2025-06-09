import { z } from "zod";

import {
  Evidence,
  EvidenceFieldValues,
  UpdateEvidenceStatusEnum,
} from "../types/evidence";
import { fileSchema } from "./common";

export const evidence = {
  defaultValues: (evidence?: Evidence) => {
    let data: EvidenceFieldValues = {
      beneficiaryId: String(evidence?.beneficiaryId) || "",

      description: evidence?.description || "description",

      status: evidence?.status || "pending review",

      file: evidence?.file || {
        id: 0, // Provide default values for required fields
        key: "",
        filename: "",
        fileUrl: "",
      },
    };

    if (evidence?.id) {
      data.id = evidence.id;
    }

    return data;
  },

  schema: z.object({
    id: z.number().optional(),

    description: z.string().optional(),

    status: z.string().min(1, "Status is a required field"),

    file: fileSchema.refine((file) => file.key !== "", {
      message: "File is a required field",
    }),
  }),
};

const beneficiaryIdSchema = z.object({
  beneficiaryId: z.string().min(1, "Beneficiary is a required field"),
});

export const completeSchema = z.intersection(
  evidence.schema,
  beneficiaryIdSchema
);

export const updateStatusSchema = z.object({
  evidenceIds: z.array(z.number()),
  status: z.nativeEnum(UpdateEvidenceStatusEnum),
  comment: z.string(),
});
