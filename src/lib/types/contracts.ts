import { z } from "zod";

import { contracts } from "lib/validators/contracts";

import { File } from "./common";

export type StatusType = "DRAFT" | "SIGNED" | "COMPLETED" | "CANCELLED" | "";

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
}

export interface IContract {
  createdAt?: string;

  createdBy?: number;

  document?: File;

  documentId?: number;

  endDate: string;

  id?: number;

  outcomenames?: string[];

  outcomes: IContractOutcomeRates[];

  parties?: string[];

  partyIds: number[];

  project?: string;

  projectId: number;

  startDate: string;

  status: StatusType;

  targetNoOfBenefeciaries: number | string;

  updatedAt?: string;

  updatedBy?: number;
}

export interface IContractFilters {
  status: StatusType;

  project: string;

  date: string;
}

export interface IContractDefaultValues {
  contract?: IContract;

  projectId?: number;
}

export type ContractFieldValues = z.infer<typeof contracts.schema>;
