import { IProject } from "../../pages/Projects/types";
import { z } from "zod";

const OutcomeSchema = z.object({
  id: z.number().optional(),

  name: z.string().min(1, "Outcome name is required"),

  description: z.string().min(1, "Description is required"),
});

export const projects = {
  defaultValues: (project?: IProject) => {
    const data: any = {
      name: project?.name || "",

      providerId: Number(project?.provider.id) || 0,

      funderId: Number(project?.funder.id) || 0,

      outcomes: project?.outcomes || [],
    };

    if (project) {
      data.id = project?.id;
    }

    return data;
  },
  schema: z.object({
    id: z.number().optional(),

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
