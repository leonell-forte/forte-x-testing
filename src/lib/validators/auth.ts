import { z } from "zod";

import { isPhoneValid } from "lib/isPhoneValid";
import { UserData } from "lib/types/auth";

export const login = {
  defaultValues: {
    email: "",

    password: "",

    remember: false,
  },

  schema: z.object({
    email: z.string().min(1, "Please enter your email").email("Invalid email"),

    password: z.string().min(1, "Please enter your password"),

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
          "Password must include at least one special character"
        ),
      confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      otp: z.string().min(6, "Please enter your otp"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
};

export const signup = {
  defaultValues: (data?: UserData) => {
    return {
      firstName: data?.firstName || "",

      lastName: data?.lastName || "",

      email: data?.email || "",

      phoneNumber: data?.phoneNumber || "+1",

      password: "",

      confirmPassword: "",

      agreeTerms: "",
    };
  },
  schema: z
    .object({
      firstName: z.string().min(1, "First name is a required field"),

      lastName: z.string().min(1, "Last name is a required field"),

      email: z
        .string()
        .min(1, "Email is a required field")
        .email("Invalid email"),

      phoneNumber: z
        .string()
        // workaround for now
        .min(3, "Phone number is a required field")
        .refine((pn) => isPhoneValid(pn), {
          message: "Invalid phone number",
        }),

      password: z
        .string()
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
          /[!@#$%^&*(),.?":{}|<>_-]/,
          "Password must contain at least one special character"
        )
        .min(8, "Password must be at least 8 characters long"),

      confirmPassword: z.string().min(1, "Passwords do not match"),

      agreeTerms: z
        .string()
        .min(1, {
          message: "You must agree to the Privacy Policy to continue",
        })
        .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
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
