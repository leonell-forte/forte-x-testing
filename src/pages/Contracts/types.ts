export interface IContractParties {
  organizationId: number;
}

export interface IContractOutcomeRates {
  projectOutcomeId: number;

  rate: number;

  perOutcome: boolean;

  threshold: string;
}

export interface IContract {
  projectId: number;

  targetNoOfBenefeciaries: string;

  document: string;

  status: "ACTIVE" | "INACTIVE";

  startDate: string;

  endDate: string;

  contractParties: IContractParties;

  contractOutcomeRates: IContractOutcomeRates[];
}
