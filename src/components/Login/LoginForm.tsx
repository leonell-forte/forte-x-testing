import Input from "../ui/input";
import Checkbox from "../ui/checkbox";
import Button from "../ui/button";
import { z } from "zod";
import { login } from "../../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cookie, useAppDispatch } from "../../lib/hooks";
import { setEmail } from "../../lib/slice/auth";
import { ILoginProps } from "./types";
import { Link, useNavigate } from "react-router-dom";
import * as amplitude from "@amplitude/analytics-browser";
import authService from "../../api/auth";
import { useState } from "react";

const LoginForm = ({ handleNext }: ILoginProps) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof login.schema>>({
    resolver: zodResolver(login.schema),
    defaultValues: login.defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof login.schema>) => {
    setLoading(true);
    try {
      const res = await authService.login(values);
      amplitude.track("Login Form Submission");
      cookie.set("access_token", res.data.token, { path: "/" });
      navigate("users");
      // handleNext!();
      // dispatch(setEmail(values.email));
      // console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 w-full">
        <div className="text-center">
          <p className="md:text-[24px]">Welcome</p>
        </div>

        <div className="flex flex-col w-full gap-[15px]">
          <Input
            onChange={(e) => setValue("email", e.target.value)}
            autoCapitalize="email"
            error={!!errors.email?.message}
            helperText={errors.email?.message}
            label="Email"
            type="email"
            autoComplete="email"
          />
          <Input
            onChange={(e) => setValue("password", e.target.value)}
            error={!!errors.password?.message}
            helperText={errors.password?.message}
            label="Password"
            type="password"
          />

          <div className="flex items-center justify-between">
            <Checkbox label="Remember password" />
            <Link to="/forgot-password" className="text-grey text-[12px]">
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="w-full text-center space-y-[15px]">
          <Button type="submit" fullWidth loading={loading}>
            Continue
          </Button>
          <div className="flex items-center gap-4">
            <hr className="w-full" />
            <p className="text-[14px] md:ext-[18px]">OR</p>
            <hr className="w-full" />
          </div>
          <Button type="button" fullWidth buttonType="secondary">
            Continue with google{" "}
          </Button>
          <p className="text-center text-[14px]">
            Don`&apos;t have an account?{" "}
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
