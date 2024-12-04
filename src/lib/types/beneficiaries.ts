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
}

export enum DisabilityStatusEnum {
  yes = "yes",

  no = "no",
}

export type IBeneficiariesFieldValues = z.infer<typeof beneficiaries.schema>;
