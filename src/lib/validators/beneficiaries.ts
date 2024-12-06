import { z } from "zod";
import {
  IBeneficiaries,
  IBeneficiariesFieldValues,
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

      riskLevel: beneficiary?.riskLevel || null,

      status: beneficiary?.status || "",

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

      disabilityStatus: beneficiary?.disabilityStatus ? "yes" : "no",

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

    phone: z.string().min(1, { message: "Phone is required" }),

    riskLevel: z
      .enum(["low", "medium", "high"], {
        message: "Risk level is required",
      })
      .nullable(),

    status: z.string().min(1, { message: "Status is required" }),

    contractId: z.number().min(1, { message: "Contract is required" }),

    projectId: z.number().min(1, { message: "Project is required" }),

    providerId: z.number().min(1),

    cohortStartDate: z.string().min(1, { message: "Start date is required" }),

    cohortEndDate: z.string().min(1, { message: "End date is required" }),

    cohortName: z.string().min(1, { message: "Program is required" }),

    linkedinUrl: z.string(),

    githubUrl: z.string(),

    otherUrl: z.string(),

    birthdate: z.string().min(1, { message: "Birthdate is required" }),

    ethnicity: z.string().min(1, { message: "Ethnicity is required" }),

    gender: z.string().min(1, { message: "Gender is required" }),

    disabilityStatus: z.enum(["yes", "no"]),

    address: z.string().min(1, { message: "Address is required" }),

    socioeconomicStatus: z
      .string()
      .min(1, { message: "Socio-economic status is required" }),

    educationLevel: z
      .string()
      .min(1, { message: "Highest education level is required" }),

    languages: z
      .array(z.string())
      .min(1, { message: "Select at least one language" }),
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
