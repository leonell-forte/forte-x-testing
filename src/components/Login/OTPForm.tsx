"use client";

import React, { useMemo, useState } from "react";
import OTPInput from "../ui/otp-input";
import Button from "../ui/button";
import { ILoginProps } from "./types";
import { useAppSelector } from "@/lib/hooks";

const OTPForm = ({ handleNext }: ILoginProps) => {
  const { email } = useAppSelector((state) => state.auth);

  const [otp, setOtp] = useState<string[]>([]);

  const isComplete = useMemo(() => !otp.some((item) => !item), [otp]);

  return (
    <div>
      <div className="text-center">
        <p className="text-[24px] md:text-[32px]">Enter confirmation code</p>
        <div className="text-[14px] md:text-[18px]">
          <p>We set a code at </p>
          <p>{email}</p>
        </div>
      </div>
      <div className="my-10">
        <OTPInput onChange={(value) => setOtp(value)} />
      </div>
      <Button
        type="button"
        onClick={handleNext}
        disabled={!isComplete}
        fullWidth
      >
        Continue
      </Button>

      <p className="text-center text-[14px] mt-[15px]">
        Didn’t receive the email?{" "}
        <button className="font-bold">Resend code</button>
      </p>
    </div>
  );
};

export default OTPForm;
