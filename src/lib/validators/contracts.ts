import {
  ContractFieldValues,
  IContract,
  IContractDefaultValues,
} from "../../lib/types/contracts";
import { z } from "zod";

const contractOutcomeSchema = z
  .object({
    outcomeId: z.number().min(1, { message: "Outcome is a required field" }),

    rate: z.union([
      z.string().min(1, { message: "Rate is a required field" }),

      z.number().min(1, { message: "Rate is a required field" }),
    ]),

    perOutcome: z.boolean(),

    threshold: z.string().optional(),
  })
  .refine(
    (data) => {
      // If perOutcome is true, threshold must exist and not be empty
      return (
        data.perOutcome || (data.threshold && data.threshold.trim().length > 0)
      );
    },

    {
      message: "Threshold is required when perOutcome is true",

      path: ["threshold"], // Points to the 'threshold' field for the error
    },
  );

export const contracts = {
  defaultValues: ({ contract, projectId }: IContractDefaultValues) => {
    let data: ContractFieldValues = {
      projectId: contract?.projectId || projectId || 0,

      targetNoOfBenefeciaries:
        contract?.targetNoOfBenefeciaries.toString() || "",

      documentId: contract?.documentId || 0,

      status: contract?.status || "ACTIVE",

      startDate: contract?.startDate || "",

      endDate: contract?.endDate || "",

      partyIds: contract?.partyIds || [],

      outcomeRates: contract
        ? contract?.outcomes.map((item) => ({
            outcomeId: item.id,

            rate: item.rate,

            perOutcome: item.perOutcome,

            threshold: item.threshold.toString(),
          }))
        : [
            {
              outcomeId: 0,

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

    documentId: z.number().min(1, { message: "Document is a required field" }),

    partyIds: z.array(z.number()).min(1, "Party is a required field"),

    status: z.enum(["ACTIVE", "INACTIVE", ""]),

    startDate: z.string().min(1, "Start date is a required field"),

    endDate: z.string().min(1, "End date is a required field"),

    outcomeRates: z.array(contractOutcomeSchema).min(1),
  }),
};
