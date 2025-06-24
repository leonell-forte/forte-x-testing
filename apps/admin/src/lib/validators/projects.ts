import { z } from "zod";

import type { IProject } from "@/lib/types/projects";

const OutcomeSchema = z.object({
  id: z.number().optional(),

  name: z.string().min(1, "Outcome name is a required field"),

  description: z.string().min(1, "Description is a required field"),
});

export const projects = {
  defaultValues: (project?: IProject, funderId?: number) => {
    const data: any = {
      name: project?.name || "",

      outcomes: project?.outcomes || [
        {
          name: "",
          description: "",
        },
      ],

      funderId: project?.funder?.id || funderId || 0,

      budget: project?.budget || "",
    };

    if (project) {
      data.id = project?.id;
    }

    return data;
  },
  schema: z.object({
    id: z.number().optional(),

    name: z.string().min(1, "Project name is a required field"),

    funderId: z.number().min(1, "Funder is a required field"),

    budget: z.string().optional(),

    outcomes: z.array(OutcomeSchema).min(1, "At least one outcome is required"),
  }),
};
