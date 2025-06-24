import type { z } from "zod";

import type { projects } from "@/lib/validators/projects";

import type { SortValues } from "./common";

export interface IOutcome {
  id: number;

  name: string;

  description: string;

  createdAt: string;

  updatedAt: string;
}

type Sub = {
  id: number;

  name: string;
};

export interface IProject {
  id: number;

  name: string;

  createdAt?: string;

  updatedAt?: string;

  outcomes: IOutcome[];

  contracts?: string[];

  providers?: string[];

  budget?: string;

  funder?: Sub;

  beneficiariesCount?: string | number;

  contractsCount?: string | number;

  milestonesCount?: string | number;

  status: "active" | "completed";

  currency?: string;
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

export enum ProjectSortLabel {
  FUNDER = `"funder"."name"`,
  PROJECT = `"project"."name"`,
  CREATED_AT = `"project"."createdAt"`,
}

export type ProjectFilter = {
  funder: string;
  status?: string;
  sortLabel?: ProjectSortLabel;
  sortValue?: SortValues;
};
