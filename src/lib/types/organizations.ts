import { z } from "zod";

import { organizations } from "lib/validators/organizations";

export interface IOrganization {
  id?: string;

  name: string;

  registeredName: string;

  regions: string[];

  type: OrgTypes;

  status: string;

  registeredAddress: string;

  state: string;

  country: string;

  postalCode: string;

  createdAt?: string; // ISO date string

  updatedAt?: string; // ISO date string

  noOfProjects?: string;

  noOfUsers?: string;

  registrationNumber?: string;
}

export type OrgTypes = "funder" | "provider" | "forte";

export interface IFilters {
  region?: string[];

  status?: string;

  type?: string;
}

export type OrganizationFieldTypes = z.infer<typeof organizations.schema>;
