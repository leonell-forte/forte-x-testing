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

      disabilityStatus: false,

      address: "",

      socioeconomicStatus: "",

      educationLevel: "",

      languages: [],
    };

    return data;
  },

  schema: z.object({
    firstName: z.string().min(1).min(1),

    lastName: z.string().min(1).min(1),

    email: z.string().min(1).min(1),

    phone: z.string().min(1).min(1),

    riskLevel: z.string().min(1),

    status: z.string().min(1),

    contractId: z.number().min(1),

    projectId: z.number().min(1),

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

    disabilityStatus: z.boolean(),

    address: z.string().min(1),

    socioeconomicStatus: z.string().min(1),

    educationLevel: z.string().min(1),

    languages: z.array(z.string().min(1)),
  }),
};
