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

      targetNoOfBenefeciaries:
        contract?.targetNoOfBenefeciaries.toString() || "",

      document: contract?.document || "",

      status: contract?.status || "ACTIVE",

      startDate: contract?.startDate
        ? formatDate(contract.startDate, "LL-dd-yyyy")
        : "",

      endDate: contract?.startDate
        ? formatDate(contract.endDate, "LL-dd-yyyy")
        : "",

      contractParties: contract?.contractParties || [],

      contractOutcomeRates: contract?.contractOutcomeRates.map((item) => ({
        ...item,

        threshold: item.rate.toString(),
      })) || [
        {
          projectOutcomeId: 0,

          rate: "",

          perOutcome: false,

          threshold: "0",
        },
      ],
    };

    if (contract) {
      data.id = contract.id;
    }

    return data;
  },

  schema: z.object({
    id: z.number().optional(),

    projectId: z.number().min(1),

    targetNoOfBenefeciaries: z.string().min(1),

    document: z.string().min(1),

    status: z.enum(["ACTIVE", "INACTIVE", ""]),

    startDate: z.string().min(1, "Required"),

    endDate: z.string().min(1, "Required"),

    contractParties: z.array(contractPartiesSchema),

    contractOutcomeRates: z.array(contractOutcomeSchema).min(1),
  }),
};
