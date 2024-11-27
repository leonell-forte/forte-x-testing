import { IContract } from "@/pages/Contracts/types";
import { z } from "zod";

const contractPartiesSchema = z.object({
  organizationId: z.number(),
});

const contractOutcomeSchema = z
  .object({
    projectOutcomeId: z.number().min(1),

    rate: z.union([z.string().min(1), z.number().min(1)]),

    perOutcome: z.boolean(),

    threshold: z.string().optional(),
  })
  .refine((data) => data.perOutcome || data.threshold !== "", {
    message: "Threshold cannot be empty",

    path: ["threshold"],
  });

export const contracts = {
  defaultValues: () => {
    let data: IContract = {
      projectId: 0,

      targetNoOfBenefeciaries: "",

      document: "",

      status: "INACTIVE",

      startDate: "",

      endDate: "",

      contractParties: [],

      contractOutcomeRates: [
        {
          projectOutcomeId: 0,

          rate: "",

          perOutcome: false,

          threshold: "",
        },
      ],
    };

    return data;
  },

  schema: z.object({
    projectId: z.number().min(1),

    targetNoOfBenefeciaries: z.string().min(1),

    document: z.string().min(1),

    status: z
      .enum(["ACTIVE", "INACTIVE", ""])
      .refine((val) => val !== "", { message: "Status cannot be empty" }),

    startDate: z.string().min(1, "Required"),

    endDate: z.string().min(1, "Required"),

    contractParties: z.array(contractPartiesSchema),

    contractOutcomeRates: z.array(contractOutcomeSchema).min(1),
  }),
};
