export const ACTION_ITEMS_LABELS = {
  activeProjects: "Monitor active projects",
  draftContracts: "Finalize contracts in draft",
  beneficiariesPending: "Message beneficiaries with pending evidence",
  openMilestones: "Check open milestones",
  evidencesPending: "Validate evidence pending review",
} satisfies Record<keyof ActionItemsType, string>;

export const ACTION_ITEMS_LINKS = {
  activeProjects: "/projects?status=active",
  draftContracts: "/contracts?status=draft",
  beneficiariesPending: "/beneficiaries?status=Pending evidence collection",
  openMilestones: "/milestones?status=open",
  evidencesPending: "/beneficiaries?status=Pending evidence review",
} satisfies Record<keyof ActionItemsType, string>;

export type ActionItemsType = {
  activeProjects: string;
  draftContracts: string;
  beneficiariesPending: string;
  openMilestones: string;
  evidencesPending: string;
};

export type TickType = {
  label: string;
  value: string | number;
};

export type SegmentType = TickType & { color: string; className?: string };

export type Project = {
  name: string;
  budget: string;
};

export type Contract = {
  name: string;
  spent: string;
};

export type Budget = {
  projects: Project[];
  contracts: Contract[];
  remainingBudget: number;
  totalBudget: number;
  totalSpent: string;
};

export type BeneficiaryStats = {
  totalBeneficiaryCount?: number;
  deltaBeneficiaryCount?: number;
  costPerBeneficiary?: number;
  noOfNewBeneficiary: number;
  noOfWithdrawnBeneficiary: number;
  noOfInProgressBeneficiary: number;
  noOfPendingEvidenceCollectionBeneficiary: number;
  noOfPendingEvidenceReviewBeneficiary: number;
  noOfSuccessfulBeneficiary: number;
  noOfUnsuccessfulBeneficiary: number;
  noOfPartiallySuccessfulBeneficiary: number;
};

enum BeneficiaryLabel {
  New = "New",
  InProgress = "In progress",
  PendingEvidenceCollection = "Pending Evidence Collection",
  PendingEvidenceReview = "Pending Evidence Review",
  PartiallySuccessful = "Partially Successful",
  Successful = "Successful",
  Unsuccessful = "Unsuccessful",
  Withdrawn = "Withdrawn",
}

export const beneficiaryLabelMap: Record<
  keyof Omit<
    BeneficiaryStats,
    "totalBeneficiaryCount" | "deltaBeneficiaryCount" | "costPerBeneficiary"
  >,
  BeneficiaryLabel
> = {
  noOfNewBeneficiary: BeneficiaryLabel.New,
  noOfInProgressBeneficiary: BeneficiaryLabel.InProgress,
  noOfPendingEvidenceCollectionBeneficiary:
    BeneficiaryLabel.PendingEvidenceCollection,
  noOfPendingEvidenceReviewBeneficiary: BeneficiaryLabel.PendingEvidenceReview,
  noOfPartiallySuccessfulBeneficiary: BeneficiaryLabel.PartiallySuccessful,
  noOfSuccessfulBeneficiary: BeneficiaryLabel.Successful,
  noOfUnsuccessfulBeneficiary: BeneficiaryLabel.Unsuccessful,
  noOfWithdrawnBeneficiary: BeneficiaryLabel.Withdrawn,
};

export enum MilestoneLabel {
  ACHIEVED = "Achieved",
  PAID = "Paid",
  INVOICED = "Invoiced",
}

export type MilestoneSegmentType = Omit<
  MilestoneType,
  | "outcomeRate"
  | "deltaOutcomeRate"
  | "paymentsPending"
  | "deltaPaymentsPending"
  | "totalMilestones"
>;

export const milestoneLabelMap: Record<
  keyof MilestoneSegmentType,
  MilestoneLabel
> = {
  noOfPaidMilestones: MilestoneLabel.PAID,
  noOfInvoicedMilestones: MilestoneLabel.INVOICED,
  noOfAcheivedMilestones: MilestoneLabel.ACHIEVED,
};

export type MilestoneType = {
  outcomeRate: number;
  deltaOutcomeRate: number;
  noOfPaidMilestones: number;
  noOfAcheivedMilestones: number;
  noOfInvoicedMilestones: number;
  paymentsPending: number;
  deltaPaymentsPending: number;
  totalMilestones: number;
};

export type ContractType = {
  totalContracts: number;
  deltaContracts: number;
  noOfDraftContracts: number;
  noOfSignedontracts: number;
  noOfCancelledContracts: number;
};

export type ProjectTypes = {
  totalProjects: number;
  deltaProjects: number;
  noOfActiveProjects: number;
  noOfCompletedProjects: number;
};

export type ProjectMilestoneType = {
  totalMilestones: number;
  noOfPaidMilestones: number;
  noOfInvoicedMilestones: number;
  noOfAcheivedMilestones: number;
  deltaMilestones: number;
};

export type ContractProgress = {
  contractName: string;
  startDate: string;
  endDate: string;
  providerName: string;
  noOfMilestones: number;
  noOfCompletedMilestones: number;
};

export type ProjectMilestone = {
  outcomeName: string | null;
  type: string;
  noOfApprovedEvidences: number;
  threshold: number;
  noOfSameMilestones: number;
  noOfAchievedMilestones: number;
  noOfPaidMilestones: number;
  noOfInvoicedMilestones: number;
};

export type ProjectMileStoneProgress = {
  contractId: number;
  contractName: string;
  milestones: ProjectMilestone[];
  targetNoOfBenefeciaries: number;
};
