type Funder = {
  name: string;
  id: string;
};

export type AdditionalFee = {
  name: string;
  amount: number;
};

export type InvoiceStatus = "Cancelled" | "Pending" | "Paid";

type MilestoneStatus = "Achieved" | "Paid" | "Open";

type Contract = Funder & {};

type Beneficiary = {
  firstName: string;
  lastName: string;
  id: string;
};

type Evidence = {
  beneficiary: Beneficiary;
  createdAt: string;
  fileName: string;
  status: string;
  updatedAt: string;
};

type MilestoneType = {
  link: string;
  title: string;
};

type Outcome = {
  id: string;
  name: string;
};

export type Milestone = {
  contract: Contract;
  cost: number;
  createdAt: string;
  evidences: Evidence[];
  id: string;
  invoiceDate: string;
  milestone: MilestoneType;
  outcome: Outcome;
  paidDate: string;
  status: MilestoneStatus;
  updatedAt: string;
};

export type Invoice = {
  additionalFee: AdditionalFee[];
  createdAt?: string;
  dueDate: string;
  funder: Funder;
  grossAmount: number;
  id: string;
  netAmount: number;
  paidDate: string;
  status: InvoiceStatus;
  items: Milestone[];
};

export type InvoiceFilters = {
  status: InvoiceStatus | "";
};
