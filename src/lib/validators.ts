import { z } from "zod";

export const login = {
  defaultValues: {
    email: "",
    password: "",
  },
  schema: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
};
