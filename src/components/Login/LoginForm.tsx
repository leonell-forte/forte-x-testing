import * as amplitude from "@amplitude/analytics-browser";
import { zodResolver } from "@hookform/resolvers/zod";
import authService from "api/auth";
import { add } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { cookie, useAppDispatch } from "lib/hooks";
import { setEmail, setRole } from "lib/slice/auth";
import { login } from "lib/validators/auth";

import Controller from "components/ui/custom-controller/CustomController";
import { Form } from "components/ui/form/Form";

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

      cookie.set("access_token", res.token, {
        path: "/",

        expires: add(new Date(), { hours: 2 }),
      });

      cookie.set("refresh_token", res?.refreshToken, { path: "/" });

      handleNext!();

      dispatch(setEmail(values.email));

      dispatch(setRole(res.role));

      cookie.set("token-email", email, { path: "/" });

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
    <div className="w-full">
      <Form form={form} onSubmit={onSubmit} className="w-full space-y-12">
        <div className="mt-10 flex w-full flex-col gap-[15px]">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                autoCapitalize="email"
                label="Email"
                type="email"
                autoComplete="off"
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
                autoComplete="off"
              />
            )}
          />

          <div className="flex items-center justify-between pl-1">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  label="Remember me"
                  white
                />
              )}
            />

            <Link
              to="/forgot-password"
              className="link-hover flex-shrink-0 whitespace-normal pt-1 text-[12px] text-grey"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[22rem] space-y-[15px] text-center">
          <Button type="submit" fullWidth loading={loading}>
            Continue
          </Button>

          <div className="flex items-center gap-4">
            <hr className="w-full" />

            <p className="text-[14px]">OR</p>

            <hr className="w-full" />
          </div>

          <Button type="button" fullWidth buttonType="secondary">
            Continue with Google{" "}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
