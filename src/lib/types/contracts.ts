import { z } from "zod";

import { contracts } from "lib/validators/contracts";

import { File } from "./common";

export type StatusType = "DRAFT" | "SIGNED" | "COMPLETED" | "CANCELLED" | "";

export type StatusRecords = Exclude<StatusType, "CANCELLED" | "">;

export type RateEnum = "Per outcome" | "If threshold reached";

export interface IContractParties {
  organizationId: number;
}

export interface IContractOutcomeRates {
  id: number;

  projectOutcomeId: number;

  rate: string | number;

  perOutcome: boolean;

  threshold: string | number;

  outcomeId?: number;

  outcome?: string;
}

export type Sub = {
  id: number;

  name: string;
};

export interface IContract {
  name: string;

  createdAt?: string;

  createdBy?: number;

  document?: File;

  documentName?: string;

  documentId?: number;

  endDate: string;

  id?: number;

  outcomenames?: string[];

  outcomes: IContractOutcomeRates[];

  provider: Sub;

  funder: Sub;

  project?: string;

  projectId: number;

  startDate: string;

  status: StatusType;

  targetNoOfBenefeciaries: number | string;

  noOfBeneficiaries: number;

  noOfMilestones: number;

  updatedAt?: string;

  updatedBy?: number;
}

export interface IContractFilters {
  status: StatusType | string;

  project: string;

  date: string;

  providerId: string;

  funderId: string;
}

export interface IContractDefaultValues {
  contract?: IContract | null;

  projectId?: number;

  providerId?: string;
}

export type ContractFieldValues = z.infer<typeof contracts.schema>;
