import { z } from "zod";
import { beneficiaries } from "../validators/beneficiaries";

export interface IBeneficiaries {
  id: number;

  contractId: number;

  email: string;

  firstName: string;

  lastName: string;

  phone: string;

  provider: string;

  cohortEndDate: string;

  cohortName: string;

  cohortStartDate: string;

  riskLevel: RiskLevelEnum;

  status: string;

  projectId?: number;

  providerId?: number;

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

export interface IBeneficiariesFilter {
  project?: string;
}
