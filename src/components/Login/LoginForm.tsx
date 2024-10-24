"use client";

import React from "react";
import Input from "../ui/input";
import Checkbox from "../ui/checkbox";
import Link from "next/link";
import Button from "../ui/button";
import { z } from "zod";
import { login } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/lib/hooks";
import { setEmail } from "@/lib/slice/auth";
import { ILoginProps } from "./types";

const LoginForm = ({ handleNext }: ILoginProps) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof login.schema>>({
    resolver: zodResolver(login.schema),
    defaultValues: login.defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof login.schema>) => {
    handleNext!();
    dispatch(setEmail(values.email));
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 w-full">
        <div className="text-center">
          <p>Welcome</p>
          <p>Log in to your account to continue</p>
        </div>

        <div className="flex flex-col w-full gap-[15px]">
          <Input
            {...register("email")}
            autoCapitalize="email"
            error={!!errors.email?.message}
            helperText={errors.email?.message}
            label="Email"
            type="email"
            autoComplete="email"
          />
          <Input
            {...register("password")}
            error={!!errors.password?.message}
            helperText={errors.password?.message}
            label="Password"
            type="password"
          />

          <div className="flex items-center justify-between">
            <Checkbox label="Remember password" />
            <Link href="/" className="text-grey text-[12px]">
              Forgot Password
            </Link>
          </div>
        </div>

        <div className="w-full text-center space-y-[15px]">
          <Button type="submit" fullWidth>
            Log in
          </Button>
          <p className="text-[14px] md:ext-[18px]">OR</p>
          <Button type="button" fullWidth buttonType="secondary">
            Log in with google{" "}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
