import { contracts } from "../../lib/validators/contracts";
import { z } from "zod";

export type StatusType = "ACTIVE" | "INACTIVE";

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
  projectId: number;

  targetNoOfBenefeciaries: string;

  document: string;

  status: StatusType;

  startDate: string;

  endDate: string;

  contractParties: IContractParties[];

  contractOutcomeRates: IContractOutcomeRates[];
}

export type ContractFieldValues = z.infer<typeof contracts.schema>;
