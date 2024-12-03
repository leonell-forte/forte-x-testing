import { z } from "zod";
import { beneficiaries } from "../validators/beneficiaries";

export interface IBeneficiaries {
  id: number;

  firstName: string;

  lastName: string;

  provider: string;

  email: string;

  phoneNumber: string;

  contract: string;

  program: string;
}

export enum DisabilityStatusEnum {
  true = "true",

  false = "false",
}

export type IBeneficiariesFieldValues = z.infer<typeof beneficiaries.schema>;
