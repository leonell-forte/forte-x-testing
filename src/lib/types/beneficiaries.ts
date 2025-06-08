import { z } from "zod";

import {
  beneficiaries,
  beneficiaryStatus,
  importBeneficiaries,
} from "../validators/beneficiaries";
import { SortValues } from "./common";
import { Evidence } from "./evidence";

export interface IBeneficiaries {
  id: number;

  contractId: string;

  contractName?: string;

  contract?: string;

  email: string;

  firstName: string;

  lastName: string;

  phoneNumber: string;

  phone: string;

  provider: string;

  cohortEndDate: string;

  program: string;

  cohortName: string;

  cohortStartDate: string;

  riskLevel: RiskLevelEnum;

  status: string;

  projectId: number;

  providerId: number;

  providerName: string;

  linkedinUrl?: string;

  githubUrl?: string;

  otherUrl?: string;

  birthdate?: string;

  ethnicity?: string;

  gender?: string;

  disabilityStatus?: boolean;

  address?: string;

  socioeconomicStatus?: string;

  educationLevel?: string;

  evidences: Evidence[];

  languages?: string[];

  createdAt?: string;

  updatedAt?: string;
}

export enum DisabilityStatusEnum {
  yes = "yes",

  no = "no",
}

export enum RiskLevelEnum {
  low = "low",

  medium = "medium",

  high = "high",
}

export type IBeneficiariesFieldValues = z.infer<typeof beneficiaries.schema>;

export type IImportBeneficiariesFieldValues = z.infer<
  typeof importBeneficiaries.schema
>;

export type BeneficiaryStatusUpdateField = z.infer<
  typeof beneficiaryStatus.schema
>;

export enum BeneficiarySortLabel {
  CREATED_AT = "createdAt",
  NAME = "fullName",
  EMAIL = "email",
}

export interface IBeneficiariesFilter {
  project?: string;

  status?: string;

  provider?: string;

  riskLevel?: string;

  startDate?: string;

  contractId?: string;

  funderId?: string;

  sortLabel?: BeneficiarySortLabel;

  sortValue?: SortValues;
}
