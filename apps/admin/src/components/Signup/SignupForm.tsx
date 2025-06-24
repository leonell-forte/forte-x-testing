"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";

import authService from "@/api/auth";
import Controller from "@/components/ui/custom-controller/CustomController";
import { Form } from "@/components/ui/form/Form";
import InputMobile from "@/components/ui/form/InputMobile";
import Spinner from "@/components/ui/spinner/spinner";
import { REDIRECT_PATHS } from "@/lib/constants";
import { cookie, useAlert } from "@/lib/hooks";
import { UserRoleType } from "@/lib/types/users";
import { signup } from "@/lib/validators/auth";

import { ILoginProps } from "../Login/types";
import Button from "../ui/button";
import Checkbox from "../ui/checkbox";
import Input from "../ui/input";

const SignupForm = ({ handleNext }: ILoginProps) => {
  const [params] = useSearchParams();

  const code = params.get("code") as string;

  const { data, isLoading } = useQuery({
    queryKey: ["invitation-profile"],

    queryFn: () => authService.getProfileByInvitation(code),

    enabled: !!code,
  });

  const form = useForm<z.infer<typeof signup.schema>>({
    resolver: zodResolver(signup.schema),

    defaultValues: signup.defaultValues(),
  });

  const {
    reset,

    control,
  } = form;

  useEffect(() => {
    if (data) {
      reset(signup.defaultValues(data));
    }
  }, [data, reset]);

  const [loading, setLoading] = useState(false);

  const { setAlert } = useAlert();

  const onSubmit = async (values: z.infer<typeof signup.schema>) => {
    setLoading(true);

    try {
      const res = await authService.signup(values, code);

      cookie.set("refresh_token", res.data.data.refreshToken, { path: "/" });
      cookie.set("access_token", res.data.data.token, { path: "/" });

      handleNext!(REDIRECT_PATHS?.[data?.role as UserRoleType]);
    } catch (err: any) {
      console.log(err);

      setAlert({
        status: "error",

        message:
          err?.response?.data?.data?.[0] ||
          err?.response?.data?.data ||
          "An error has occurred. Please check if you used correct invitation link.",

        title: "Sign up failed",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="w-full" role="main">
      <Form
        form={form}
        onSubmit={onSubmit}
        className="w-full space-y-12"
        noValidate
        aria-label="Sign Up Form"
      >
        {/* Form Fields Section */}
        <div
          className="mt-10 flex w-full flex-col gap-[15px]"
          role="group"
          aria-label="Personal Information"
        >
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                id="firstName"
                autoComplete="given-name"
                label="First name"
                required
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "firstName-error" : undefined}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                id="lastName"
                autoComplete="family-name"
                label="Last name"
                required
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "lastName-error" : undefined}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                id="email"
                type="email"
                autoComplete="email"
                disabled={!!data}
                label="Email"
                required
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputMobile
                {...field}
                label="Phone number"
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "phone-error" : undefined}
              />
            )}
          />

          <div
            role="group"
            aria-label="Password Fields"
            className="space-y-[15px]"
          >
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  id="password"
                  type="password"
                  label="Password"
                  required
                  aria-required="true"
                  aria-invalid={!!error}
                  aria-describedby={error ? "password-error" : undefined}
                  autoComplete="new-password"
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  id="confirmPassword"
                  type="password"
                  label="Re-enter password"
                  required
                  aria-required="true"
                  aria-invalid={!!error}
                  aria-describedby={
                    error ? "confirm-password-error" : undefined
                  }
                  autoComplete="new-password"
                />
              )}
            />
          </div>

          <Controller
            name="agreeTerms"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div role="group" aria-label="Terms and Conditions">
                <Checkbox
                  {...field}
                  id="agreeTerms"
                  white
                  labelClass="font-medium"
                  aria-required="true"
                  aria-invalid={!!error}
                  aria-describedby={error ? "terms-error" : undefined}
                  onChange={(e) => {
                    field.onChange(e.target.checked ? "true" : "");
                  }}
                  label={
                    <span className="text-sm">
                      I have read, understand, and agree to be bound by the{" "}
                      <Link
                        to="https://test.forteglobal.com/terms"
                        className="link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Terms of Use (opens in new tab)"
                      >
                        Terms of Use
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="https://forteglobal.com/privacy-policy"
                        className="link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Privacy Policy (opens in new tab)"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  }
                />
              </div>
            )}
          />
        </div>

        {/* Action Buttons Section */}
        <div
          className="mx-auto w-full max-w-[22rem] space-y-[15px] text-center"
          role="group"
          aria-label="Sign Up Options"
        >
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
            aria-busy={loading}
            aria-label={loading ? "Signing up..." : "Sign up"}
          >
            {loading ? "Signing up..." : "Sign up"}
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
            onClick={() => authService.googleSignup(code)}
            aria-label="Sign up with Google account"
          >
            Sign up with Google
          </Button>
        </div>

        <p className="text-center text-[14px]" role="contentinfo">
          Have an account?{" "}
          <Link className="font-bold" to="/" aria-label="Go to login page">
            Log in
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignupForm;
