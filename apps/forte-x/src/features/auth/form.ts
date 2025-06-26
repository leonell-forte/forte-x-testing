import { formSchemas } from "@repo/ui/hooks/useZodForm";
import { z } from "zod";

export const loginForm = {
  defaultValues: {
    email: "",
    password: "",
    rememberMe: false,
  },
  schema: z.object({
    email: formSchemas.email(),
    password: formSchemas.password(6),
    rememberMe: formSchemas.boolean(),
  }),
};

export type LoginFormData = z.infer<typeof loginForm.schema>;
