"use client";

import classNames from "classnames";
import { useEffect, useState } from "react";

interface IOTPInputProps {
  onChange: (value: string[]) => void;
}

const OTPInput = ({ onChange }: IOTPInputProps) => {
  const [otp, setOtp] = useState(Array(6).fill("")); // Change 4 to your desired OTP length

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

  useEffect(() => {
    const debounce = setTimeout(() => {
      onChange(otp);
    }, 50);

    return () => clearTimeout(debounce);
  }, [otp, onChange]);

  return (
    <div className="mx-auto flex w-fit gap-2 sm:gap-[10px]">
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
              "aspect-square w-full rounded-xl bg-white !bg-opacity-[50%] text-center !text-[24px] text-forest-green outline-none md:rounded-xl md:!text-[40px]",

              digit && "!bg-mint"
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default OTPInput;
