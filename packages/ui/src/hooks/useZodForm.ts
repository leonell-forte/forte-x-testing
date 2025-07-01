import { useForm, type UseFormProps, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type UseZodFormProps<T extends z.ZodType> = {
  schema: T;
} & Omit<UseFormProps<z.infer<T>>, 'resolver'>;

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
  email: () => z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: (minLength = 6) => z.string().min(1, 'Password is required').min(minLength, `Password must be at least ${minLength} characters`),
  confirmPassword: () => z.string().min(1, 'Please confirm your password'),
  name: () => z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  phone: () => z.string().min(1, 'Phone number is required').regex(/^[+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  url: () => z.string().url('Please enter a valid URL'),
  required: (message = 'This field is required') => z.string().min(1, message),
  optional: () => z.string().optional(),
  boolean: () => z.boolean().optional(),
};

// Helper for password confirmation validation
export function createPasswordConfirmSchema(passwordField = 'password', confirmField = 'confirmPassword') {
  return z.object({
    [passwordField]: formSchemas.password(),
    [confirmField]: formSchemas.confirmPassword(),
  }).refine((data) => data[passwordField as keyof typeof data] === data[confirmField as keyof typeof data], {
    message: "Passwords don't match",
    path: [confirmField],
  });
}