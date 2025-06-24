"use client";

import * as amplitude from "@amplitude/analytics-browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import authService from "@/api/auth";
import { OTPInput } from "@/components/ui/form/OTPInput";
import { useAlert, useAppSelector } from "@/lib/hooks";
import { password } from "@/lib/validators/auth";

import Button from "../ui/button";
import Input from "../ui/input";
import { ILoginProps } from "./types";

interface IProps extends ILoginProps {
  handleBack?: () => void;
}

const ResetPasswordForm = ({ handleNext, handleBack }: IProps) => {
  const { email } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const { setAlert } = useAlert();

  const {
    handleSubmit,

    control,

    formState: { errors },
  } = useForm<z.infer<typeof password.schema>>({
    resolver: zodResolver(password.schema),

    defaultValues: password.defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof password.schema>) => {
    setLoading(true);
    try {
      await authService.resetPassword(values, email);
      handleNext!();
      amplitude.track("Reset Password Submission");
    } catch (err: any) {
      setAlert({
        status: "error",
        message: err.response.data.message,
        title: "Reset Password Failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="text-center">
        <p className="text-[24px] md:text-[32px]">Create a new password</p>

        <p className="text-[14px] md:text-[18px]">
          Please choose a password with at least 8 characters, including one
          uppercase letter, one number, and one special character. Choose
          something you haven&apos;t used before.
        </p>
      </div>

      <div className="space-y-10">
        <div className="space-y-4 text-center">
          <label htmlFor="" className="!text-[24px] font-medium">
            Verification code
          </label>
          1
          <Controller
            control={control}
            name="otp"
            render={({ field }) => {
              return <OTPInput onChange={(value) => field.onChange(value)} />;
            }}
          />
        </div>
        <div className="mx-3 space-y-[15px]">
          <Controller
            name="password"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  placeholder="New password"
                  type="password"
                  error={!!errors.password?.message}
                  helperText={errors.password?.message}
                />
              );
            }}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm new password"
                  error={!!errors?.confirmPassword?.message}
                  helperText={errors.confirmPassword?.message}
                />
              );
            }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[22rem] space-y-4">
        <Button type="submit" fullWidth loading={loading}>
          Reset password
        </Button>

        <Button onClick={handleBack} buttonType="secondary" fullWidth>
          Back
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
