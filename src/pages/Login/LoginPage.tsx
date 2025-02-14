import { useQuery } from "@tanstack/react-query";
import authService from "api/auth";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import jobs from "assets/images/login/spot-choiceofjobs.png";

import LoginForm from "components/Login/LoginForm";
import OTPForm from "components/Login/OTPForm";
import Card from "components/ui/card";
import Spinner from "components/ui/spinner/spinner";

const LoginPage = () => {
  const { isLoading } = useQuery({
    queryKey: ["check"],

    queryFn: authService.check,

    retry: 1,

    refetchOnWindowFocus: false,
  });

  const navigate = useNavigate();

  const [step] = useState(0);

  // const handleNextStep = () => {
  //   setStep((prev) => prev + 1);
  // };

  const renderStep = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return (
            <LoginForm
              handleNext={(path) => navigate(path || "/beneficiaries")} // remove OTP form temporarily
            />
          );

        case 1:
          return (
            <OTPForm
              handleNext={(path) => navigate(path || "/beneficiaries")}
            />
          );
      }
    },
    [navigate]
  );

  if (isLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="main-container grid min-h-screen grid-cols-1 items-center gap-12 px-10 lg:grid-cols-2 lg:py-10 xl:gap-[70px]">
      <div className="hidden lg:block">
        <div className="mx-auto h-auto w-auto max-w-[437px] md:mx-0">
          <img alt="jobs" src={jobs} />
        </div>

        <div className="max-w-xs space-y-6 text-center md:max-w-full md:text-left">
          <p className="font-famaime text-[40px] leading-[110%] md:text-[52px]">
            Work with the best
          </p>

          <p className="text-[18px] leading-[110%] md:text-[20px]">
            Access the world&rsquo;s best training providers and courses from
            Forte&rsquo;s carefully vetted global network. See how they compare
            in an objective, standardized way.
          </p>
        </div>
      </div>

      <Card className="mx-auto flex h-full w-full items-center px-4 pb-24 pt-4 md:px-10 md:pt-24 lg:max-h-[838px] lg:w-full lg:max-w-[580px] lg:pt-12">
        <div className="mx-auto w-full max-w-[350px] space-y-5 md:max-w-[450px]">
          <img
            alt="logo"
            src="/logo.png"
            className="mx-auto h-auto w-auto max-w-[122px]"
          />

          {renderStep(step)}
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
