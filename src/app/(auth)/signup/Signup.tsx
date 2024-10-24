import SignupForm from "@/components/Signup/SignupForm";
import Card from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const Signup = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-[99px] items-center h-[95vh]">
      <div className="hidden lg:block">
        <div className="max-w-[437px] w-auto h-auto mx-auto md:mx-0">
          <Image
            width={437}
            height={437}
            alt="jobs"
            src={"/images/signup/spot-future-skills.png"}
            priority
          />
        </div>
        <div className="space-y-6 text-center md:text-left">
          <p className="text-[40px] md:text-[52px] font-famaime leading-[110%]">
            Unlocking Human <br /> Potential
          </p>
          <p className="text-[18px] md:text-[24px] leading-[110%]">
            We’re building a future of work that works for everyone <br />- by
            funding effective training at no cost to students, and no risk to
            governments.
          </p>
        </div>
      </div>

      <Card className="px-10 py-12 md:py-[74px] h-fit flex items-center">
        <div className="max-w-[400px] mx-auto space-y-5 w-full">
          <Image
            width={122}
            height={122}
            alt="logo"
            src="/logo.png"
            className="w-auto h-auto mx-auto"
          />

          <SignupForm />
        </div>
      </Card>
    </div>
  );
};

export default Signup;
