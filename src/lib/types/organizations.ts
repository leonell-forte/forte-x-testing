import { z } from "zod";

import { organizations, partner } from "lib/validators/organizations";

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

  type?: "funder" | "provider" | "forte" | "";
}

type PartnerData = {
  id: number;
  name: string;
  registeredName: string;
  registeredNumber: string;
};

export type Partner = {
  id?: string;
  partner: PartnerData;
  createdAt?: string; // Consider using Date if you plan to work with date objects
};

export type OrganizationFieldTypes = z.infer<typeof organizations.schema>;

export type PartnerFieldTypes = z.infer<typeof partner.schema>;

export type BankDetails = {
  bankName: string;
  last4Digits: string;
  accountHolderName: string | null;
  status: string;
  routingNumber: string;
};
