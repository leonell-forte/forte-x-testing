import { z } from "zod";

import {
  IBeneficiaries,
  IBeneficiariesFieldValues,
  RiskLevelEnum,
} from "../types/beneficiaries";

interface IBeneficiaryDefaultValue {
  beneficiary?: IBeneficiaries;

  projectId?: number;
}

export const beneficiaries = {
  defaultValues: ({ beneficiary, projectId }: IBeneficiaryDefaultValue) => {
    let data: IBeneficiariesFieldValues = {
      firstName: beneficiary?.firstName || "",

      lastName: beneficiary?.lastName || "",

      email: beneficiary?.email || "",

      phone: beneficiary?.phone || "",

      riskLevel: (beneficiary?.riskLevel.toLowerCase() as RiskLevelEnum) || "",

      status: beneficiary?.status || "New",

      contractId: beneficiary?.contractId || 0,

      projectId: beneficiary?.projectId || projectId || 0,

      providerId: beneficiary?.providerId || 0,

      cohortStartDate: beneficiary?.cohortStartDate || "",

      cohortEndDate: beneficiary?.cohortEndDate || "",

      cohortName: beneficiary?.cohortName || "",

      linkedinUrl: beneficiary?.linkedinUrl || "",

      githubUrl: beneficiary?.githubUrl || "",

      otherUrl: beneficiary?.otherUrl || "",

      birthdate: beneficiary?.birthdate || "",

      ethnicity: beneficiary?.ethnicity || "",

      gender: beneficiary?.gender || "",

      disabilityStatus: !beneficiary
        ? ""
        : beneficiary?.disabilityStatus
          ? "yes"
          : "no",

      address: beneficiary?.address || "",

      socioeconomicStatus: beneficiary?.socioeconomicStatus || "",

      educationLevel: beneficiary?.educationLevel || "",

      languages: beneficiary?.languages || [],
    };

    if (beneficiary) {
      data.id = beneficiary.id;
    }

    return data;
  },

  schema: z.object({
    id: z.number().optional(),

    firstName: z.string().min(1, { message: "Firstname is required" }),

    lastName: z.string().min(1, { message: "Lastname is required" }),

    email: z.string().email(),

    phone: z.string(),

    riskLevel: z.string(),

    status: z.string().min(1, { message: "Status is required" }),

    contractId: z.number().min(1, { message: "Contract is required" }),

    projectId: z.number().min(1, { message: "Project is required" }),

    providerId: z.number().min(1, { message: "Provider is required" }),

    cohortStartDate: z.string(),

    cohortEndDate: z.string(),

    cohortName: z.string(),

    linkedinUrl: z.string(),

    githubUrl: z.string(),

    otherUrl: z.string(),

    birthdate: z.string(),

    ethnicity: z.string(),

    gender: z.string(),

    disabilityStatus: z.enum(["yes", "no", ""]),

    address: z.string(),

    socioeconomicStatus: z.string(),

    educationLevel: z.string(),

    languages: z.array(z.string()),
  }),
};

export const beneficiaryStatus = {
  default: {
    status: "",
  },

  schema: z.object({
    status: z.string().min(1, "Status is a required field"),
  }),
};

export const importBeneficiaries = {
  defaultValue: {
    file: undefined,

    isOverwriteByEmailEnabled: false,
  },

  schema: z.object({
    file: z
      .custom<File>((value) => value instanceof File && value.size > 0, {
        message: "Invalid file. Please upload a valid file.",
      })
      .nullable(),

    isOverwriteByEmailEnabled: z.boolean(),
  }),
};
