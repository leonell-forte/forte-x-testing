import { z } from "zod";

export const generateInvoiceForm = {
  defaultValues: {
    startDate: "",
    endDate: "",
    organizationId: "",
  },
  schema: z.object({
    organizationId: z.string().min(1, "Funder is a required field"),

    startDate: z.string().min(1, "Start date is required"),

    endDate: z.string().min(1, "Start date is required"),
  }),
};

export type TGenerateInvoice = z.infer<typeof generateInvoiceForm.schema>;
