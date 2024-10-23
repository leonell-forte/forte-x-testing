import React from "react";
import Input from "../ui/input";
import Button from "../ui/button";

const ResetPasswordForm = () => {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <p className="text-[24px] md:text-[32px]">Create a new password</p>
        <p className="text-[14px] md:text-[18px]">
          Please choose a password that hasn’t been used before. Must be at
          least 8 characters.
        </p>
      </div>

      <div className="flex flex-col gap-[15px]">
        <Input placeholder="Reset new password" type="password" />
        <Input placeholder="Confirm new password" type="password" />
      </div>

      <Button fullWidth>Reset password</Button>
    </div>
  );
};

export default ResetPasswordForm;
