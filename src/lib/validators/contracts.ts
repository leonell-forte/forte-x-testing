import { IContract } from "../../lib/types/contracts";
import { z } from "zod";
import { formatDate } from "../utils";

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
  .refine((data) => data.perOutcome || !!data.threshold, {
    message: "Threshold cannot be empty",

    path: ["threshold"],
  });

export const contracts = {
  defaultValues: (contract?: IContract) => {
    let data: IContract = {
      projectId: contract?.projectId || 0,

      targetNoOfBenefeciaries: contract?.targetNoOfBenefeciaries || "",

      document: contract?.document || "",

      status: contract?.status || "active",

      startDate: contract?.startDate
        ? formatDate(contract.startDate, "LL-dd-yyyy")
        : "",

      endDate: contract?.startDate
        ? formatDate(contract.endDate, "LL-dd-yyyy")
        : "",

      contractParties: contract?.contractParties || [],

      contractOutcomeRates: contract?.contractOutcomeRates || [
        {
          projectOutcomeId: 0,

          rate: "",

          perOutcome: false,

          threshold: "0",
        },
      ],
    };

    return data;
  },

  schema: z.object({
    projectId: z.number().min(1),

    targetNoOfBenefeciaries: z.string().min(1),

    document: z.string().min(1),

    status: z.enum(["active", "inactive", ""]),

    startDate: z.string().min(1, "Required"),

    endDate: z.string().min(1, "Required"),

    contractParties: z.array(contractPartiesSchema),

    contractOutcomeRates: z.array(contractOutcomeSchema).min(1),
  }),
};
