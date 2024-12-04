import { projects } from "../../lib/validators/projects";
import { z } from "zod";

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
