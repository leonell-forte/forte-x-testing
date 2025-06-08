import { z } from "zod";

import { organizations, partner } from "lib/validators/organizations";

import { SortValues } from "./common";

export type OrgStatus = "active" | "inactive";

export interface IOrganization {
  id?: string;

  name: string;

  registeredName: string;

  regions: string[];

  type: OrgTypes;

  status: OrgStatus;

  registeredAddress: string;

  state: string;

  country: string;

  postalCode: string;

  createdAt?: string; // ISO date string

  updatedAt?: string; // ISO date string

  noOfProjects?: number;

  noOfUsers?: string;

  registrationNumber?: string;

  noOfPartners?: number;

  noOfContracts?: number;

  noOfBeneficiaries?: number;

  noOfMilestones?: number;

  invoiceFrequency?: "monthly" | "quarterly" | "yearly";
  invoiceFrequecy?: "monthly" | "quarterly" | "yearly";
  invoice_frequency?: "monthly" | "quarterly" | "yearly";

  currency?: string;
}

export type OrgTypes = "funder" | "provider" | "forte";

export interface IFilters {
  region?: string[];

  status?: string;

  type?: "funder" | "provider" | "forte" | "";

  sortLabel?: "createdAt" | "name";

  sortValue?: SortValues;
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
  status: OrgStatus;
  routingNumber: string;
};
