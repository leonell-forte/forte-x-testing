import { z } from "zod";

import { projects } from "lib/validators/projects";

export interface IOutcome {
  id: number;

  name: string;

  description: string;

  createdAt: string;

  updatedAt: string;
}

export interface IProject {
  id: number;

  name: string;

  createdAt?: string;

  updatedAt?: string;

  outcomes: IOutcome[];

  contracts?: string[];

  providers?: string[];
}

export type ProjectFieldValues = z.infer<typeof projects.schema>;
