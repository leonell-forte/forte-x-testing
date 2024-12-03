import { z } from "zod";
import { IBeneficiariesFieldValues } from "../types/beneficiaries";

export const beneficiaries = {
  defaultValues: () => {
    let data: IBeneficiariesFieldValues = {
      firstName: "",

      lastName: "",

      email: "",

      phone: "",

      riskLevel: "",

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

      disabilityStatus: "false",

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

    email: z.string().min(1, { message: "Invalid email" }),

    phone: z.string().min(1, { message: "Phone is required" }),

    riskLevel: z.string().min(1, { message: "Risk level is required" }),

    status: z.string().min(1, { message: "Status is required" }),

    contractId: z.number().min(1, { message: "Contract is required" }),

    projectId: z.number().min(1, { message: "Project is required" }),

    providerId: z.number().min(1),

    cohortStartDate: z.string().min(1).date(),

    cohortEndDate: z.string().min(1).date(),

    cohortName: z.string().min(1),

    linkedinUrl: z.string().min(1).url(),

    githubUrl: z.string().min(1).url(),

    otherUrl: z.string().min(1).url(),

    birthdate: z.string().min(1).date(),

    ethnicity: z.string().min(1),

    gender: z.string().min(1),

    disabilityStatus: z.enum(["true", "false"]),

    address: z.string().min(1),

    socioeconomicStatus: z.string().min(1),

    educationLevel: z.string().min(1),

    languages: z.array(z.string()).min(1),
  }),
};
