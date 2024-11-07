import { z } from "zod";

export const users = {
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    organizationId: "",
    role: "",
  },
  schema: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phoneNumber: z.string().min(1),
    organizationId: z.string().min(1),
    role: z.string().min(1),
  }),
};
