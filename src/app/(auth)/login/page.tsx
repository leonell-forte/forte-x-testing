import LoginForm from "@/components/Login/LoginForm";
import OTPForm from "@/components/Login/OTPForm";
import ResetPasswordForm from "@/components/Login/ResetPasswordForm";
import Card from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const LoginPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-[99px] items-center h-[95vh]">
      <div className="hidden lg:block">
        <div className="max-w-[437px] w-auto h-auto mx-auto md:mx-0">
          <Image
            width={437}
            height={437}
            alt="jobs"
            src={"/images/login/spot-choiceofjobs.png"}
            priority
          />
        </div>
        <div className="space-y-6 text-center md:text-left">
          <p className="text-[40px] md:text-[52px] font-famaime leading-[110%]">
            Providing the world’s talent with opportunity
          </p>
          <p className="text-[18px] md:text-[24px] leading-[110%]">
            We believe connecting talent with opportunity reduces hardship.
            We’re working towards a world free from financial stress, and where
            everyone has dignity and the freedom to choose their own path in
            life.
          </p>
        </div>
      </div>

      <Card className="px-10 py-24 max-h-[838px] h-full flex items-center">
        <div className="max-w-[400px] mx-auto space-y-5 w-full">
          <Image
            width={122}
            height={122}
            alt="logo"
            src="/forte-logo.png"
            className="w-auto h-auto mx-auto"
          />
          {/* <LoginForm /> */}
          {/* <OTPForm /> */}
          <ResetPasswordForm />
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
