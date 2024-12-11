import { contracts } from "../../lib/validators/contracts";
import { z } from "zod";

export type StatusType = "ACTIVE" | "INACTIVE" | "";

export type RateEnum = "Per outcome" | "If threshold reached";

export interface IContractParties {
  organizationId: number;
}

export interface IContractOutcomeRates {
  projectOutcomeId: number;

  rate: string | number;

  perOutcome: boolean;

  threshold: string;
}

export interface IContract {
  id?: number;

  projectId: number;

  targetNoOfBenefeciaries: string;

  documentId: number;

  status: StatusType;

  startDate: string;

  endDate: string;

  partyIds: number[];

  outcomeRates: IContractOutcomeRates[];

  createdAt?: string;

  updatedAt?: string;

  project?: string;

  outcomes?: string; // Specify the type better if outcomes can have different types (e.g., number, boolean).
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
