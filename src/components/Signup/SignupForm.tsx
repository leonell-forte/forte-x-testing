"use client";

import React from "react";
import Input from "../ui/input";
import Checkbox from "../ui/checkbox";
import Button from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signup } from "../../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signup.schema>>({
    resolver: zodResolver(signup.schema),
    defaultValues: signup.defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof signup.schema>) => {
    console.log(values);
    navigate("/");
  };
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
        <div className="text-center">
          <p className="text-[18px] md:text-[24px]">
            Hello, create your account
          </p>
        </div>

        <div className="flex flex-col w-full gap-[15px]">
          <Input
            onChange={(e) => setValue("fullname", e.target.value)}
            autoComplete="name"
            label="Your full name"
            error={!!errors.fullname?.message}
            helperText={errors.fullname?.message}
          />
          <Input
            onChange={(e) => setValue("email", e.target.value)}
            type="email"
            label="Email"
            error={!!errors.email?.message}
            helperText={errors.email?.message}
          />
          <Input
            onChange={(e) => setValue("phone_number", e.target.value)}
            autoComplete="tel"
            label="Phone number"
            error={!!errors.phone_number?.message}
            helperText={errors.phone_number?.message}
          />
          <Input
            onChange={(e) => setValue("password", e.target.value)}
            label="Password"
            type="password"
            error={!!errors.password?.message}
            helperText={errors.password?.message}
          />
          <Input
            onChange={(e) => setValue("confirm_password", e.target.value)}
            label="Re-enter password"
            type="password"
            error={!!errors.confirm_password?.message}
            helperText={errors.confirm_password?.message}
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label={
                <p>
                  I agree to all the{" "}
                  <Link to="/" className="link">
                    Terms, Privacy
                  </Link>{" "}
                  and{" "}
                  <Link to="/" className="link">
                    Fees
                  </Link>
                </p>
              }
            />
          </div>
        </div>

        <div className="w-full text-center space-y-[15px]">
          <Button type="submit" fullWidth>
            Sign up
          </Button>
          <p className="text-[14px] md:ext-[18px]">OR</p>
          <Button type="button" fullWidth buttonType="secondary">
            Sign up with google{" "}
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
