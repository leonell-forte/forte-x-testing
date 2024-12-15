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

  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const renderStep = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return <LoginForm handleNext={handleNextStep} />;

        case 1:
          return <OTPForm handleNext={() => navigate("/users")} />;
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
    <div className="main-container grid h-[95vh] grid-cols-1 items-start gap-10 py-10 md:gap-[99px] md:px-[86px] lg:grid-cols-2 lg:items-center">
      <div className="hidden lg:block">
        <div className="mx-auto h-auto w-auto max-w-[437px] md:mx-0">
          <img alt="jobs" src={jobs} />
        </div>

        <div className="space-y-6 text-center md:text-left">
          <p className="font-famaime text-[40px] leading-[110%] md:text-[52px]">
            Providing the world’s talent with opportunity
          </p>

          <p className="text-[18px] leading-[110%] md:text-[20px]">
            We believe connecting talent with opportunity reduces hardship.
            We’re working towards a world free from financial stress, and where
            everyone has dignity and the freedom to choose their own path in
            life.
          </p>
        </div>
      </div>

      <Card className="mx-auto flex h-full max-h-fit w-fit min-w-[300px] items-center px-10 py-24 sm:min-w-[500px] lg:max-h-[838px] lg:w-full">
        <div className="mx-auto w-full max-w-[450px] space-y-5">
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
