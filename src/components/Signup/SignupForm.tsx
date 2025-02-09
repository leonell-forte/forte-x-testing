"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import authService from "api/auth";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { REDIRECT_PATHS } from "lib/constants";
import { cookie, useAlert } from "lib/hooks";
import { UserRoleType } from "lib/types/users";
import { signup } from "lib/validators/auth";

import Spinner from "components/ui/spinner/spinner";

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

  const {
    setValue,

    handleSubmit,

    formState: { errors },

    reset,

    control,
  } = useForm<z.infer<typeof signup.schema>>({
    resolver: zodResolver(signup.schema),

    defaultValues: signup.defaultValues(),
  });

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

      cookie.set("access_token", res.data.data.token, { path: "/" });

      handleNext!(REDIRECT_PATHS?.[data?.role as UserRoleType]);
    } catch (err: any) {
      console.log(err);

      setAlert({
        status: "error",

        message:
          err.response.data.data ||
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
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        <div className="flex w-full flex-col gap-1">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                autoComplete="given-name"
                label="First name"
                error={!!errors.firstName?.message}
                helperText={errors.firstName?.message}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                autoComplete="family-name"
                label="Last name"
                error={!!errors.lastName?.message}
                helperText={errors.lastName?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                autoComplete="off"
                disabled={!!data}
                type="email"
                label="Email"
                error={!!errors.email?.message}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                autoComplete="tel"
                label="Phone number"
                error={!!errors.phoneNumber?.message}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Password"
                type="password"
                error={!!errors.password?.message}
                helperText={errors.password?.message}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Re-enter password"
                type="password"
                error={!!errors.confirmPassword?.message}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />

          <div className="flex items-center justify-between">
            <Checkbox
              labelClass="font-medium"
              helperText={errors.agreeTerms?.message}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue("agreeTerms", "true");
                } else {
                  setValue("agreeTerms", "");
                }
              }}
              label={
                <>
                  I agree to
                  <Link
                    to="https://forteglobal.com/privacy-policy"
                    className="link"
                    target="_blank"
                  >
                    {" "}
                    Privacy Policy
                  </Link>{" "}
                </>
              }
            />
          </div>
        </div>

        <div className="w-full space-y-[15px] text-center">
          <Button type="submit" fullWidth loading={loading}>
            Continue
          </Button>
          <div className="flex items-center gap-4">
            <hr className="w-full" />

            <p className="md:ext-[18px] text-[14px]">OR</p>

            <hr className="w-full" />
          </div>{" "}
          <Button
            type="button"
            fullWidth
            buttonType="secondary"
            onClick={() => authService.googleSignup(code)}
          >
            Continue with Google{" "}
          </Button>
        </div>

        <p className="text-center text-[14px]">
          Have an account?{" "}
          <Link className="font-bold" to="/">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
