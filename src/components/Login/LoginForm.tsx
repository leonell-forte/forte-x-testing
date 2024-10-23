import Image from "next/image";
import React from "react";
import Input from "../ui/input";
import Checkbox from "../ui/checkbox";
import Link from "next/link";
import Button from "../ui/button";

const LoginForm = () => {
  return (
    <div className="flex flex-col items-center w-full gap-5">
      <Image
        width={122}
        height={122}
        alt="logo"
        src="/forte-logo.png"
        className="w-auto h-auto"
      />

      <div className="space-y-10 w-full">
        <div className="text-center">
          <p>Welcome</p>
          <p>Log in to your account to continue</p>
        </div>

        <div className="flex flex-col w-full gap-[15px]">
          <Input label="Email" />
          <Input label="Password" />

          <div className="flex items-center justify-between">
            <Checkbox label="Remember password" />
            <Link href="/" className="text-grey text-[12px]">
              Forgot Password
            </Link>
          </div>
        </div>

        <div className="w-full text-center space-y-[15px]">
          <Button fullWidth>Log in</Button>
          <p className="text-[18px]">OR</p>
          <Button fullWidth buttonType="secondary">
            Log in with google{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
