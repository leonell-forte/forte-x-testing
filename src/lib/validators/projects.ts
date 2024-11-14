import { z } from "zod";

const OutcomeSchema = z.object({
  name: z.string().min(1, "Outcome name is required"),
  description: z.string().min(1, "Description is required"),
});

export const projects = {
  defaultValues: () => {
    const data = {
      name: "",
      providerId: 0,
      funderId: 0,
      outcomes: [],
    };
    return data;
  },
  schema: z.object({
    name: z.string().min(1, "Project name is required"),
    funderId: z
      .number()
      .min(1, { message: "Please select funder organizastion" }),
    providerId: z
      .number()
      .min(1, { message: "Please select provider organization" }),
    outcomes: z.array(OutcomeSchema).min(1, "At least one outcome is required"),
  }),
};
