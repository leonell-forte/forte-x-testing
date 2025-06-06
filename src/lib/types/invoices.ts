import { SortValues } from "./common";
import { IMilestone } from "./milestones";

type Funder = {
  name: string;
  id: string;
};

export type AdditionalFee = {
  name: string;
  amount: number;
};

export type InvoiceStatus = "cancelled" | "pending" | "paid";

export type Invoice = {
  id: string;
  cost: number;
  createdAt: string;
  funder: Funder;
  paymentLink: string;
  status: InvoiceStatus;
  noOfMilestones: number;
  milestones: IMilestone[];
  paidAt: string;
  currency?: string;
};

export enum SortInvoiceLabel {
  ID = `"invoice"."id"`,
  CREATED_AT = `"invoice"."created_at"`,
}

export type InvoiceFilters = {
  status: InvoiceStatus | "";

  sortLabel: SortInvoiceLabel;

  sortValue: SortValues;
};
