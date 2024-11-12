import { z } from "zod";

export const organizations = {
  defaultValues: {
    name: "",
    registeredName: "",
    registeredAddress: "",
    registrationNumber: "",
    state: "",
    country: "",
    postalCode: "",
    region: "",
    type: "",
    status: "",
  },
  schema: z.object({
    name: z.string().min(1),
    registeredName: z.string().min(1),
    registeredAddress: z.string().min(1),
    registrationNumber: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    postalCode: z.string().min(1),
    region: z.string().min(1),
    type: z.string().min(1),
    status: z.string().min(1),
  }),
};
