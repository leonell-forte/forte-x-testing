import { z } from "zod";

import { isPhoneValid } from "lib/isPhoneValid";

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

      phone: beneficiary?.phone || "+1",

      riskLevel: (beneficiary?.riskLevel?.toLowerCase() as RiskLevelEnum) || "",

      status: beneficiary?.status || "New",

      contractId: beneficiary?.contractId || 0,

      projectId: beneficiary?.projectId || projectId || 0,

      providerId: beneficiary?.providerId || 0,

      cohortStartDate: beneficiary?.cohortStartDate || null,

      cohortEndDate: beneficiary?.cohortEndDate || null,

      cohortName: beneficiary?.program || "",

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

    firstName: z.string().min(1, { message: "First name is required" }),

    lastName: z.string().min(1, { message: "Last name is required" }),

    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Invalid email" }),

    phone: z
      .string()
      .refine((pn) => isPhoneValid(pn), {
        message: "Invalid phone number",
      })
      .or(z.literal("+1")),

    riskLevel: z.string(),

    status: z.string().min(1, { message: "Status is required" }),

    contractId: z.number().min(1, { message: "Contract is required" }),

    providerId: z.number().min(1, { message: "Provider is required" }),

    projectId: z.number().min(1, { message: "Project is required" }),

    cohortStartDate: z.string().nullable(),

    cohortEndDate: z.string().nullable(),

    cohortName: z.string(),

    linkedinUrl: z
      .string()
      .url("LinkedIn must be a valid URL")
      .or(z.literal("")),

    githubUrl: z.string().url("Github must be a valid URL").or(z.literal("")),

    otherUrl: z.string().url("Please use a valid URL").or(z.literal("")),

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
