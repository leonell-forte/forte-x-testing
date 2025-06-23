import { z } from "zod";

import {
  ContractFieldValues,
  IContractDefaultValues,
} from "lib/types/contracts";
import { formatDate } from "lib/utils";

const getDateData = (outcome: any) => {
  if (outcome.daysAfterBeneficiaryStartDate)
    return {
      dateType: "afterStart",
      date: String(outcome.daysAfterBeneficiaryStartDate) || "",
    };
  if (outcome.daysAfterBeneficiaryEndDate)
    return {
      dateType: "afterEnd",
      date: String(outcome.daysAfterBeneficiaryEndDate) || "",
    };
  return {
    dateType: "date",
    date: outcome.dueDate ? formatDate(outcome.dueDate, "LL-dd-yyyy") : "",
  };
};

const contractOutcomeSchema = z
  .object({
    outcomeId: z.number().min(1, { message: "Outcome is a required field" }),

    rate: z.union([
      z.string().min(1, { message: "Rate is a required field" }),

      z.number().min(1, { message: "Rate is a required field" }),
    ]),

    perOutcome: z.boolean(),

    threshold: z.string().optional(),

    dateType: z.string().optional(),

    date: z.string().optional(),
  })
  .refine(
    (data) => {
      // If perOutcome is true, threshold must exist and not be empty
      return (
        data.perOutcome || (data.threshold && data.threshold.trim().length > 0)
      );
    },

    {
      message: "Threshold is required when per outcome is not selected",

      path: ["threshold"], // Points to the 'threshold' field for the error
    }
  );

export const contracts = {
  defaultValues: ({
    contract,
    projectId,
    providerId,
  }: IContractDefaultValues) => {
    let data: ContractFieldValues = {
      name: contract?.name || "",

      projectId: contract?.projectId || projectId || 0,

      targetNoOfBenefeciaries:
        contract?.targetNoOfBenefeciaries.toString() || "",

      documentId: contract?.documentId || 0,

      status: contract?.status || "draft",

      startDate: contract?.startDate || "",

      endDate: contract?.endDate || "",

      providerId: contract?.provider.id || (providerId ? +providerId : 0), // Changed from toString()

      outcomeRates: contract
        ? contract?.outcomes.map((item) => ({
            outcomeId: item.outcomeId as number,

            rate: item.rate,

            perOutcome: item.perOutcome,

            threshold: item.threshold.toString(),



            ...getDateData(item),
          }))
        : [
            {
              outcomeId: 0,

              rate: "",

              perOutcome: true,

              threshold: "",

              dateType: "date",

              date: "",
            },
          ],
    };

    if (contract) {
      data.id = contract.id;
    }

    return data;
  },

  schema: z.object({
    id: z.string().optional(),

    name: z.string().min(1, "Contract name is a required field"),

    providerId: z.number().min(1, "Provider is a required field"), // Changed from string()

    projectId: z.number().min(1, { message: "Project is a required field" }),

    targetNoOfBenefeciaries: z.string().min(1, {
      message: "Target number of beneficiaries is a required field",
    }),

    documentId: z.number().min(1, { message: "Document is a required field" }),

    status: z.enum(["draft", "signed", "completed", "cancelled", ""]),

    startDate: z.string().min(1, "Start date is a required field"),

    endDate: z.string().min(1, "End date is a required field"),

    outcomeRates: z.array(contractOutcomeSchema).min(1),
  }),
};
