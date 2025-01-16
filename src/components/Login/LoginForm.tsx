import * as amplitude from "@amplitude/analytics-browser";
import { zodResolver } from "@hookform/resolvers/zod";
import authService from "api/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { cookie, useAppDispatch } from "lib/hooks";
import { setEmail, setRole } from "lib/slice/auth";
import { login } from "lib/validators/auth";

import Button from "../ui/button";
import Checkbox from "../ui/checkbox";
import Input from "../ui/input";
import { ILoginProps } from "./types";

const LoginForm = ({ handleNext }: ILoginProps) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const {
    handleSubmit,

    getValues,

    formState: { errors },

    setValue,

    setError,
  } = useForm<z.infer<typeof login.schema>>({
    resolver: zodResolver(login.schema),

    defaultValues: login.defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof login.schema>) => {
    setLoading(true);

    try {
      const res = await authService.login(values);

      amplitude.track("Login Form Submission");

      cookie.set("access_token", res.token, { path: "/" });

      handleNext!();

      dispatch(setEmail(values.email));

      dispatch(setRole(res.role));
    } catch (err) {
      console.log(err);

      setError("password", { message: "Incorrect email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-10">
        <div className="mt-10 flex w-full flex-col gap-[15px]">
          <Input
            onChange={(e) => setValue("email", e.target.value)}
            error={!!errors.email?.message || !!errors.password?.message}
            autoCapitalize="email"
            label="Email"
            type="email"
            autoComplete="off"
          />

          <Input
            onChange={(e) => setValue("password", e.target.value)}
            error={!!errors.email?.message || !!errors.password?.message}
            helperText={errors.email?.message || errors.password?.message}
            label="Password"
            type="password"
            autoComplete="off"
          />

          <div className="flex items-center justify-between pl-1">
            <Checkbox
              value={getValues("remember")}
              onChange={(e) => {
                console.log(e.target.checked);

                setValue("remember", e.target.checked);
              }}
              label="Remember me"
            />
            <Link to="/forgot-password" className="pt-1 text-[12px] text-grey">
              Forgot password?
            </Link>
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
          </div>

          <Button type="button" fullWidth buttonType="secondary">
            Continue with Google{" "}
          </Button>

          <p className="text-center text-[14px]">
            Don&apos;t have an account?{" "}
            <Link className="font-bold" to="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
