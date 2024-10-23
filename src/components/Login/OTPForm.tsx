import React from "react";
import OTPInput from "../ui/otp-input";
import Button from "../ui/button";

const OTPForm = () => {
  return (
    <div>
      <div className="text-center">
        <p className="text-[24px] md:text-[32px]">Enter confirmation code</p>
        <div className="text-[14px] md:text-[18px]">
          <p>We set a code at </p>
          <p>“erri_hensburg34@gmail.com”</p>
        </div>
      </div>
      <div className="my-10">
        <OTPInput />
      </div>
      <Button fullWidth>Continue</Button>

      <p className="text-center text-[14px] mt-[15px]">
        Didn’t receive the email?{" "}
        <button className="font-bold">Resend code</button>
      </p>
    </div>
  );
};

export default OTPForm;
