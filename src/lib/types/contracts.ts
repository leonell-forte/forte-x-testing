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

  document: string;

  status: StatusType;

  startDate: string;

  endDate: string;

  contractParties: IContractParties[];

  contractOutcomeRates: IContractOutcomeRates[];
}

export interface IContractDetails {
  id: number;

  projectId: number;

  targetNoOfBenefeciaries: number;

  document: string;

  status: string;

  startDate: string;

  endDate: string;

  createdAt: string;

  updatedAt: string;

  parties: string;

  project: string;

  outcomes: string; // Specify the type better if outcomes can have different types (e.g., number, boolean).
}

export interface IContractFilters {
  status: StatusType;

  project: string;

  date: string;
}

export type ContractFieldValues = z.infer<typeof contracts.schema>;
