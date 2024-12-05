import { IContract, IContractDefaultValues } from "../../lib/types/contracts";
import { z } from "zod";
import { formatDate } from "../utils";
import { DEFAULT_DATE_FORMAT } from "../constants";

const contractPartiesSchema = z.object({
  organizationId: z.number(),
});

const contractOutcomeSchema = z
  .object({
    projectOutcomeId: z
      .number()
      .min(1, { message: "Outcome is a required field" }),

    rate: z.union([
      z.string().min(1, { message: "Rate is a required field" }),

      z.number().min(1, { message: "Rate is a required field" }),
    ]),

    perOutcome: z.boolean(),

    threshold: z.string().optional(),
  })
  .refine((data) => data.perOutcome || !!data.threshold, {
    message: "Threshold cannot be empty",

    path: ["threshold"],
  });

export const contracts = {
  defaultValues: ({ contract, projectId }: IContractDefaultValues) => {
    let data: IContract = {
      projectId: contract?.projectId || projectId || 0,

      targetNoOfBenefeciaries:
        contract?.targetNoOfBenefeciaries.toString() || "",

      document: contract?.document || "",

      status: contract?.status || "ACTIVE",

      startDate: contract?.startDate
        ? formatDate(contract.startDate, DEFAULT_DATE_FORMAT)
        : "",

      endDate: contract?.startDate
        ? formatDate(contract.endDate, DEFAULT_DATE_FORMAT)
        : "",

      contractParties: contract?.contractParties || [],

      contractOutcomeRates: contract
        ? contract?.contractOutcomeRates.map((item) => ({
            ...item,

            threshold: item.threshold.toString(),
          }))
        : [
            {
              projectOutcomeId: 0,

              rate: "",

              perOutcome: true,

              threshold: "",
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

    projectId: z.number().min(1, { message: "Project is a required field" }),

    targetNoOfBenefeciaries: z.string().min(1, {
      message: "Target number of beneficiaries is a required field",
    }),

    document: z.string().min(1, { message: "Document is a required field" }),

    status: z.enum(["ACTIVE", "INACTIVE", ""]),

    startDate: z.string().min(1, "Start date is a required field"),

    endDate: z.string().min(1, "End date is a required field"),

    contractParties: z
      .array(contractPartiesSchema)
      .min(1, { message: "Party is a required field" }),

    contractOutcomeRates: z.array(contractOutcomeSchema).min(1),
  }),
};
