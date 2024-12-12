import { z } from "zod";
import { EvidenceData, EvidenceFieldValues } from "../types/evidence";

export const evidence = {
  defaultValues: (evidence?: EvidenceData) => {
    let data: EvidenceFieldValues = {
      description: evidence?.description || "",

      status: evidence?.status || "",

      outcomeId: "",

      fileId: 0,
    };

    return data;
  },

  schema: z.object({
    description: z.string().min(1, "Description is a required field"),

    status: z.string().min(1, "Status is a required field"),

    outcomeId: z.string().min(1, "Outcome is a required field"),

    fileId: z.number().min(1, "File is a required field"),
  }),
};
