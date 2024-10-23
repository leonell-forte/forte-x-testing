import { z } from "zod";

export const login = {
  defaultValues: {
    email: "",
    password: "",
  },
  schema: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
  }),
};

export const password = {
  defaultValues: {
    new: "",
    confirm: "",
  },
  schema: z
    .object({
      new: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one special character"
        ),
      confirm: z.string().min(8, "Password must be at least 8 characters long"),
    })
    .refine((data) => data.new === data.confirm, {
      message: "Passwords do not match",
      path: ["confirm"], // Error will appear on `confirm` field
    }),
};
