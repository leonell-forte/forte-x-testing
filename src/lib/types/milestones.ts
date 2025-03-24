export type StatusType = "DRAFT" | "SIGNED" | "COMPLETED" | "CANCELLED" | "";

export type StatusRecords = Exclude<StatusType, "CANCELLED" | "">;

export type MilestoneStatus = "Achieved" | "Paid" | "Open";

export type EvidenceStatus =
  | "Accepted"
  | "Pending Review"
  | "More Information Requested"
  | "Invoiced"
  | "Rejected"
  | "Paid";

type TMileStoneDetails = {
  title: string;
  link: string;
};

type TBeneficiary = {
  id: string;
  firstName: string;
  lastName: string;
};

type TEvidence = {
  fileName: string;
  status: EvidenceStatus;
  createdAt: string;
  updatedAt: string;
  beneficiary: TBeneficiary;
};

export interface IMilestone {
  id: string;
  outcome: {
    id: string;
    name: string;
  };
  contractName: string;
  status: MilestoneStatus;
  invoiceDate: string;
  paidDate: string;
  milestone: TMileStoneDetails;
  evidences: TEvidence[];
  cost: number;
  createdAt: string;
  updatedAt: "2025-03-13T05:28:17.905Z";

  //   name: string;

  //   createdAt?: string;

  //   createdBy?: number;

  //   document?: File;

  //   documentName?: string;

  //   documentId?: number;

  //   endDate: string;

  //   id?: number;

  //   outcomenames?: string[];

  //   provider: {
  //     id: number;
  //     name: string;
  //   };

  //   project?: string;

  //   projectId: number;

  //   startDate: string;

  //   status: StatusType;

  //   targetNoOfBenefeciaries: number | string;

  //   updatedAt?: string;

  //   updatedBy?: number;
}

export interface IMilestoneFilters {
  status: StatusType | string;
}
