import * as amplitude from "@amplitude/analytics-browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { add } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import authService from "@/api/auth";
import Controller from "@/components/ui/custom-controller/CustomController";
import { Form } from "@/components/ui/form/Form";
import { cookie, useAppDispatch } from "@/lib/hooks";
import { setEmail, setSessionToken } from "@/lib/slice/auth";
import { login } from "@/lib/validators/auth";

import Button from "../ui/button";
import Checkbox from "../ui/checkbox";
import Input from "../ui/input";
import { ILoginProps } from "./types";

const LoginForm = ({ handleNext }: ILoginProps) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof login.schema>>({
    resolver: zodResolver(login.schema),

    defaultValues: login.defaultValues,
  });

  const {
    control,

    setValue,

    setError,

    watch,
  } = form;

  const [isRemember, email] = watch(["remember", "email"]);

  const onSubmit = async (values: z.infer<typeof login.schema>) => {
    setLoading(true);

    try {
      const res = await authService.login(values);

      amplitude.track("Login Form Submission");

      dispatch(setSessionToken(res.sessionToken));

      dispatch(setEmail(values.email));

      cookie.set("token-email", email, { path: "/" });

      handleNext?.();

      if (isRemember) {
        const currentDate = new Date();

        // Add 30 days to the current date for cookie expiry
        const futureDate = add(currentDate, { days: 30 });

        cookie.set("user-email", email, { expires: futureDate });

        return;
      }
      cookie.remove("user-email");
    } catch (err) {
      console.log(err);

      setError("password", { message: "Incorrect email or password" });
    } finally {
      setLoading(false);
    }
  };

  const userEmail = cookie.get("user-email");

  useEffect(() => {
    if (userEmail) {
      setValue("email", userEmail);
      setValue("remember", true);
    }
  }, [userEmail, setValue]);

  return (
    <div className="w-full" role="main">
      <Form
        form={form}
        onSubmit={onSubmit}
        className="w-full space-y-12"
        aria-label="Login Form"
        noValidate
      >
        <div
          className="mt-10 flex w-full flex-col gap-[15px]"
          role="group"
          aria-label="Login Credentials"
        >
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div role="presentation">
                <Input
                  {...field}
                  id="email-input"
                  type="email"
                  label="Email Address"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "email-error" : undefined}
                />
              </div>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div role="presentation">
                <Input
                  {...field}
                  id="password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "password-error" : undefined}
                />
              </div>
            )}
          />

          <div
            className="flex items-center justify-between pl-1"
            role="group"
            aria-label="Additional Options"
          >
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  label="Remember me"
                  white
                  aria-label="Remember me on this device"
                />
              )}
            />

            <Link
              to="/forgot-password"
              className="link-hover text-grey flex-shrink-0 whitespace-normal pt-1 text-[12px]"
              aria-label="Forgot password? Click to reset"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div
          className="mx-auto w-full max-w-[22rem] space-y-[15px] text-center"
          role="group"
          aria-label="Login Options"
        >
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
            aria-busy={loading}
            aria-label={
              loading ? "Logging in..." : "Log in with your credentials"
            }
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>

          <div
            className="flex items-center gap-4"
            role="separator"
            aria-label="or separator"
          >
            <hr className="w-full" aria-hidden="true" />
            <p className="text-[14px]" aria-hidden="true">
              OR
            </p>
            <hr className="w-full" aria-hidden="true" />
          </div>

          <Button
            type="button"
            fullWidth
            buttonType="secondary"
            onClick={() => {
              /* Google login handler */
            }}
            aria-label="Log in with Google account"
          >
            Log in with Google
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
