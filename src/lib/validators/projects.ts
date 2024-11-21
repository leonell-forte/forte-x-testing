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

    outcomes: z.array(OutcomeSchema).min(1, "At least one outcome is required"),
  }),
};
