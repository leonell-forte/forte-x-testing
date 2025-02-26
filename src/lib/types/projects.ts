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

  funderId?: number;
}

export interface IProjectOrganization {
  id: number;

  name: string;

  registeredName: string;

  registeredAddress: string;

  registrationNumber: string;

  type: string;

  status: string;

  regions: string[];

  users: string;

  contracts: string;

  projects: string;
}

export type ProjectFieldValues = z.infer<typeof projects.schema>;
