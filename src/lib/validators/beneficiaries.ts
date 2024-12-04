import { z } from "zod";
import { IBeneficiariesFieldValues } from "../types/beneficiaries";

export const beneficiaries = {
  defaultValues: () => {
    let data: IBeneficiariesFieldValues = {
      firstName: "",

      lastName: "",

      email: "",

      phone: "",

      riskLevel: null,

      status: "",

      contractId: 0,

      projectId: 0,

      providerId: 0,

      cohortStartDate: "",

      cohortEndDate: "",

      cohortName: "",

      linkedinUrl: "",

      githubUrl: "",

      otherUrl: "",

      birthdate: "",

      ethnicity: "",

      gender: "",

      disabilityStatus: "no",

      address: "",

      socioeconomicStatus: "",

      educationLevel: "",

      languages: [],
    };

    return data;
  },

  schema: z.object({
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
