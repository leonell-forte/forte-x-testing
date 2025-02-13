"use client";

import { useMemo, useState } from "react";

import { REDIRECT_PATHS } from "lib/constants";
import { useAppSelector } from "lib/hooks";
import { UserRoleType } from "lib/types/users";

import { queryClient } from "components/QueryProvider";

import Button from "../ui/button";
import OTPInput from "../ui/otp-input";
import { ILoginProps } from "./types";

const OTPForm = ({ handleNext }: ILoginProps) => {
  const { email, role } = useAppSelector((state) => state.auth);

  const [otp, setOtp] = useState<string[]>([]);

  const isComplete = useMemo(() => !otp.some((item) => !item), [otp]);

  const handleContinue = () => {
    sessionStorage.setItem("otp", otp.join(""));

    queryClient.invalidateQueries({ queryKey: ["profile"] });

    handleNext!(REDIRECT_PATHS[role as UserRoleType]);
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

      <Button
        type="button"
        eventName="OTP"
        onClick={handleContinue}
        disabled={!isComplete}
        fullWidth
      >
        Log in
      </Button>

      <p className="mt-[15px] text-center text-[14px]">
        Didn&apos;t receive the email?{" "}
        <button className="font-bold">Resend code</button>
      </p>
    </div>
  );
};

export default OTPForm;
