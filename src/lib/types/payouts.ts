import { IMilestone } from "./milestones";

export type Filter = {
  provider: string;
  status: string;
};

export type PayoutStatus = "pending" | "settled" | "draft";

type Provider = {
  id: number;
  name: string;
};

export type Payout = {
  id: string;
  amount: string;
  status: PayoutStatus;
  createdAt: string; // ISO 8601 date string
  provider: Provider;
  settledAt: string | null;
  updatedAt: string | null;
  noOfMilestones: string;
  milestones: IMilestone[];
};
