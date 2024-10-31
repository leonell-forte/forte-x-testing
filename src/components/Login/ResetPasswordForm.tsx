"use client";

import Input from "../ui/input";
import Button from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { password } from "../../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ILoginProps } from "./types";
import * as amplitude from "@amplitude/analytics-browser";

const ResetPasswordForm = ({ handleNext }: ILoginProps) => {
  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof password.schema>>({
    resolver: zodResolver(password.schema),
    defaultValues: password.defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof password.schema>) => {
    console.log(values);

    amplitude.track("Reset Password Submission");
    handleNext!();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="text-center">
        <p className="text-[24px] md:text-[32px]">Create a new password</p>
        <p className="text-[14px] md:text-[18px]">
          Please choose a password that hasn’t been used before. Must be at
          least 8 characters.
        </p>
      </div>

      <div className="flex flex-col gap-[15px]">
        <Input
          onChange={(e) => setValue("new", e.target.value)}
          placeholder="Reset new password"
          type="password"
          error={!!errors.new?.message}
          helperText={errors.new?.message}
        />
        <Input
          onChange={(e) => setValue("confirm", e.target.value)}
          placeholder="Confirm new password"
          type="password"
          error={!!errors?.confirm?.message}
          helperText={errors.confirm?.message}
        />
      </div>

      <Button type="submit" fullWidth>
        Reset password
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
