import { z } from "zod";

import { Evidence, EvidenceFieldValues } from "../types/evidence";
import { fileSchema } from "./common";

export const evidence = {
  defaultValues: (evidence?: Evidence) => {
    let data: EvidenceFieldValues = {
      beneficiaryId: String(evidence?.beneficiaryId) || "",

      description: evidence?.description || "",

      status: evidence?.status || "pending review",

      milestoneId: "",

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

    description: z.string().min(1, "Description is a required field"),

    status: z.string().min(1, "Status is a required field"),

    milestoneId: z.string(),

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
