import { contracts } from "../../lib/validators/contracts";
import { z } from "zod";

export type StatusType = "ACTIVE" | "INACTIVE" | "";

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
}

export interface IContract {
  createdAt?: string;

  createdBy?: number;

  document?: string;

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
