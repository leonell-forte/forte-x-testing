"use client";

import { useState } from "react";
import Input from "../ui/input";
import Checkbox from "../ui/checkbox";
import Button from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { signup } from "../../lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import authService from "../../api/auth";
import { cookie, useAlert } from "../../lib/hooks";
import { ILoginProps } from "../Login/types";

const SignupForm = ({ handleNext }: ILoginProps) => {
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();

  const code = params.get("code") as string;

  const { setAlert } = useAlert();

  const {
    setValue,

    handleSubmit,

    formState: { errors },

    control,
  } = useForm<z.infer<typeof signup.schema>>({
    resolver: zodResolver(signup.schema),

    defaultValues: signup.defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof signup.schema>) => {
    setLoading(true);

    try {
      const res = await authService.signup(values, code);

      cookie.set("access_token", res.data.data.token, { path: "/" });

      handleNext!();
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
  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 w-full"
      >
        <div className="flex flex-col w-full gap-1">
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

        <div className="w-full text-center space-y-[15px]">
          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Continue
          </Button>
          <div className="flex items-center gap-4">
            <hr className="w-full" />

            <p className="text-[14px] md:ext-[18px]">OR</p>

            <hr className="w-full" />
          </div>{" "}
          <Button
            type="button"
            fullWidth
            buttonType="secondary"
          >
            Continue with Google{" "}
          </Button>
        </div>

        <p className="text-center text-[14px]">
          Have an account?{" "}
          <Link
            className="font-bold"
            to="/"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
