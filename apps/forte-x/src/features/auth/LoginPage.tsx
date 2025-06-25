import { Button } from "@repo/ui/components/button";
import Form from "@repo/ui/components/forms/form";
import FormCheckbox from "@repo/ui/components/forms/form-checkbox";
import FormInput from "@repo/ui/components/forms/form-input";
import { formSchemas, useZodForm } from "@repo/ui/hooks/useZodForm";
import { z } from "zod";

import { logo } from "@/assets";
import { ModeToggle } from "@/components/mode-toggle";

// Clean schema definition using helpers
const loginSchema = z.object({
  email: formSchemas.email(),
  password: formSchemas.password(6),
  rememberMe: formSchemas.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const form = useZodForm({
    schema: loginSchema,
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Login data:", data);
    // Handle login logic here
  };

  return (
    <div className="from-primary/20 via-accent/10 to-secondary/30 dark:from-primary/10 dark:via-accent/5 dark:to-secondary/20 flex h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute -right-40 -top-40 h-80 w-80 rounded-full blur-3xl"></div>
        <div className="bg-accent/10 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl"></div>
        <div className="bg-secondary/5 absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-card/80 border-border/50 rounded-2xl border p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="from-primary to-accent mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br">
              <img src={logo} alt="Forte Logo" className="h-auto w-14" />
            </div>
            <h1 className="text-foreground mb-2 text-2xl font-bold">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <Form onSubmit={onSubmit} form={form} className="space-y-6">
            <div className="space-y-2">
              {/* Email Field */}
              <FormInput name="email" label="Email" />
              {/* Password Field */}
              <FormInput name="password" label="Password" type="password" />
            </div>

            {/* Remember Me & Forgot Password */}
            <FormCheckbox
              control={form.control}
              name="rememberMe"
              label="Remember Me"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-primary hover:text-primary/80 text-sm transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </Form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="border-border/50 w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card text-muted-foreground px-4">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="border-border hover:bg-muted/50 flex items-center justify-center rounded-lg border px-4 py-3 transition-colors"
            >
              <svg className="text-foreground h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-foreground ml-2 text-sm font-medium">
                Google
              </span>
            </button>
            <button
              type="button"
              className="border-border hover:bg-muted/50 flex items-center justify-center rounded-lg border px-4 py-3 transition-colors"
            >
              <svg
                className="text-foreground h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-foreground ml-2 text-sm font-medium">
                Facebook
              </span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
