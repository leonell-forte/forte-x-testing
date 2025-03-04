"use client";

import authService from "api/auth";
import { useEffect, useMemo, useState } from "react";

import { REDIRECT_PATHS } from "lib/constants";
import { cookie, useAlert, useAppSelector } from "lib/hooks";
import { UserRoleType } from "lib/types/users";

import Button from "../ui/button";
import OTPInput from "../ui/otp-input";
import { ILoginProps } from "./types";

const OTPForm = ({ handleNext }: ILoginProps) => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const { email, role, sessionToken } = useAppSelector((state) => state.auth);

  const [otp, setOtp] = useState<string[]>([]);

  const { setAlert } = useAlert();

  const isComplete = useMemo(() => !otp.some((item) => !item), [otp]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const res = await authService.verifyCode(sessionToken, otp.join(""));
      cookie.set("access_token", res.token, {
        path: "/",
      });
      cookie.set("refresh_token", res?.refreshToken, { path: "/" });
      handleNext?.(REDIRECT_PATHS[role as UserRoleType]);
    } catch (err) {
      console.log(err);
      setAlert({
        message: "Please make sure you used the correct OTP",
        title: "Invalid OTP",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setCountdown(120);
      await authService.resendOtp(sessionToken);
      setAlert({
        message: "OTP has been resent to your email",
        title: "OTP Sent",
        status: "success",
      });
    } catch (err) {
      console.log(err);
      setAlert({
        message: "Failed to resend OTP",
        title: "Error",
        status: "error",
      });
    }
  };

  return (
    <div>
      <div className="text-center">
        <p className="text-[24px] md:text-[32px]">Enter code</p>

        <div className="text-[14px] md:text-[18px]">
          <p>A code has been sent to </p>

          <p>{email}.</p>
        </div>
      </div>

      <div className="my-10">
        <OTPInput onChange={(value) => setOtp(value)} />
      </div>
      <div className="mx-auto w-full max-w-[22rem] space-y-[15px] text-center">
        <Button
          type="button"
          eventName="OTP"
          onClick={handleContinue}
          disabled={!isComplete}
          loading={loading}
          fullWidth
        >
          Log in
        </Button>

        <p className="mt-[15px] text-center text-[14px]">
          Didn&apos;t receive the email?{" "}
          <button
            onClick={resendOtp}
            disabled={isResendDisabled}
            className={`font-bold ${isResendDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {isResendDisabled ? `Resend code in ${countdown}s` : "Resend code"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPForm;
