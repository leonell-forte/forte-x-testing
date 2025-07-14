import { zodResolver } from "@hookform/resolvers/zod";
import { compareAsc } from "date-fns";
import {
  type UseFormProps,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { z } from "zod";

import { isPhoneValid } from "../lib/utils";

type UseZodFormProps<T extends z.ZodType> = {
  schema: T;
} & Omit<UseFormProps<z.infer<T>>, "resolver">;

export function useZodForm<T extends z.ZodType>(
  props: UseZodFormProps<T>
): UseFormReturn<z.infer<T>> {
  const { schema, ...formProps } = props;

  return useForm({
    ...formProps,
    resolver: zodResolver(schema),
  });
}

// Optional: Type-safe form data extractor
export type InferFormData<T extends z.ZodType> = z.infer<T>;

// Optional: Helper for creating form schemas with common patterns
export const formSchemas = {
  email: () =>
    z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: (minLength = 6) =>
    z
      .string()
      .min(1, "Password is required")
      .min(minLength, `Password must be at least ${minLength} characters`),
  confirmPassword: () => z.string().min(1, "Please confirm your password"),
  name: () =>
    z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
  phone: () =>
    z.string().refine((pn) => isPhoneValid(pn), {
      message: "Invalid phone number",
    }),
  url: () => z.string().url("Please enter a valid URL"),
  required: (message = "This field is required") => z.string().min(1, message),
  optional: () => z.string().optional(),
  boolean: () => z.boolean().optional(),
  dateRange: () =>
    z
      .object({
        from: z.date({ required_error: "Start date is required" }),
        to: z.date({ required_error: "End date is required" }),
      })
      .refine(
        (data) => {
          console.log(compareAsc(data.to, data.from));
          return compareAsc(data.to, data.from) <= 0;
        },
        {
          message: "End date must be after start date",
          path: ["to"],
        }
      ),
};

// Helper for password confirmation validation
export function createPasswordConfirmSchema(
  passwordField = "password",
  confirmField = "confirmPassword"
) {
  return z
    .object({
      [passwordField]: formSchemas.password(),
      [confirmField]: formSchemas.confirmPassword(),
    })
    .refine(
      (data) =>
        data[passwordField as keyof typeof data] ===
        data[confirmField as keyof typeof data],
      {
        message: "Passwords don't match",
        path: [confirmField],
      }
    );
}
