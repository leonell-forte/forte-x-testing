"use client";

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Grid2 } from "@mui/material";
import classNames from "classnames";

const OTPInput = () => {
  const [otp, setOtp] = useState(Array(4).fill("")); // Change 4 to your desired OTP length

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    // Move focus to the next input
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Move focus back to the previous input
    if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }

    setOtp(newOtp);
  };

  return (
    <div className="flex gap-4 md:gap-[30px] w-fit mx-auto">
      {otp.map((digit, index) => (
        <div key={index} className="flex items-center justify-center">
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            maxLength={1}
            className={classNames(
              "w-10 md:w-[76px] h-10 md:h-[76px] rounded-xl md:rounded-[20px] bg-white bg-opacity-[50%] text-center text-[40px] text-forest-green outline-none",
              digit && "bg-mint"
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default OTPInput;
