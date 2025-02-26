import { zodResolver } from "@hookform/resolvers/zod";
import authService from "api/auth";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAlert, useAppDispatch } from "lib/hooks";
import { setEmail } from "lib/slice/auth";
import { resetRequest } from "lib/validators/auth";

import Button from "../ui/button";
import Input from "../ui/input";
import { ILoginProps } from "./types";

const ResetRequestForm = ({ handleNext }: ILoginProps) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { setAlert } = useAlert();

  const {
    control,

    handleSubmit,

    formState: { errors },
  } = useForm<z.infer<typeof resetRequest.schema>>({
    resolver: zodResolver(resetRequest.schema),

    defaultValues: resetRequest.defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof resetRequest.schema>) => {
    setLoading(true);

    try {
      const res = await authService.forgotPassword(values.email);

      setAlert({
        message: res.data.message,

        title: "OTP Sent!",

        status: "success",
      });

      dispatch(setEmail(values.email));

      handleNext!();
    } catch (err: any) {
      setAlert({
        message: err.response.data.message,

        title: "Error",

        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-12 text-center"
    >
      <div className="space-y-4">
        <div>
          <p className="text-[24px] font-medium md:text-[32px]">
            Reset password
          </p>

          <p className="text-[18px]">
            Forgot your password? Enter your email and we&apos;ll send you a
            6-digit code.
          </p>
        </div>

        <Controller
          name="email"
          control={control}
          render={({ field }) => {
            return (
              <Input
                {...field}
                helperText={errors.email?.message}
                error={!!errors.email?.message}
                label="Email"
              />
            );
          }}
        />
      </div>

      <div className="mx-auto flex max-w-[22rem] flex-col gap-4">
        <Button loading={loading} type="submit">
          Get 6-digit code
        </Button>

        <Button buttonType="tertiary" onClick={() => navigate("/")}>
          Go back
        </Button>
      </div>
    </form>
  );
};

export default ResetRequestForm;
