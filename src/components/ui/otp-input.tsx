import classNames from "classnames";
import React from "react";
import { useEffect, useState } from "react";

interface IOTPInputProps {
  onChange: (value: string[]) => void;
  digits?: number;
}

const OTPInput = ({ onChange, digits }: IOTPInputProps) => {
  const [otp, setOtp] = useState(Array(digits || 6).fill(""));

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

    setOtp(newOtp);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent, currentIndex: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\s/g, "");
    if (!pastedData.match(/^[0-9]+$/)) return; // Only allow numbers

    const otpArray = pastedData.split("").slice(0, otp.length - currentIndex);
    const newOtp = [...otp];

    otpArray.forEach((value, index) => {
      const targetIndex = currentIndex + index;
      if (targetIndex < otp.length) {
        newOtp[targetIndex] = value;
      }
    });

    setOtp(newOtp);

    // Focus last filled input or next empty input
    const targetIndex = Math.min(
      currentIndex + otpArray.length,
      otp.length - 1
    );
    const targetInput = document.getElementById(`otp-input-${targetIndex}`);
    if (targetInput) {
      targetInput.focus();
    }
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
            type="number"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)}
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
