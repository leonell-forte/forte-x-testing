import { z } from "zod";

export const login = {
  defaultValues: {
    email: "",

    password: "",

    remember: false,
  },

  schema: z.object({
    email: z.string().email("Incorrect email or password"),

    password: z
      .string()
      .min(8, "Incorrect email or password")
      .regex(/[a-z]/, "Incorrect email or password")
      .regex(/[A-Z]/, "Incorrect email or password")
      .regex(/\d/, "Incorrect email or password")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Incorrect email or password"),
    remember: z.boolean(),
  }),
};

export const password = {
  defaultValues: {
    password: "",

    confirmPassword: "",
  },
  schema: z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/\d/, "Password must inlcude at least one number")
        .regex(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must include at least one special character",
        ),
      confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
};

export const signup = {
  defaultValues: {
    firstName: "",

    lastName: "",

    email: "",

    phoneNumber: "",

    password: "",

    confirmPassword: "",

    agreeTerms: "",
  },
  schema: z
    .object({
      firstName: z.string().min(1),

      lastName: z.string().min(1),

      email: z.string().email(),

      phoneNumber: z.string().min(1),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one special character",
        ),

      confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long"),

      agreeTerms: z
        .string()
        .min(1, {
          message: "You must agree to the Privacy Policy to continue",
        })
        .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirm_password"], // This will cause the error to appear under the confirm_password field
    }),
};

export const resetRequest = {
  defaultValues: {
    email: "",
  },

  schema: z.object({
    email: z.string().email(),
  }),
};
