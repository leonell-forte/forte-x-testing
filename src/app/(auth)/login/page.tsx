import LoginForm from "@/components/Login/LoginForm";
import Card from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const LoginPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-[99px] items-center">
      <div>
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
      <div>
        <Card className="px-10 py-24 md:py-[196px]">
          <div className="max-w-[400px] mx-auto">
            <LoginForm />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
