import { useCallback, useState } from "react";

import jobs from "assets/images/login/spot-choiceofjobs.png";

import OTPForm from "components/Login/OTPForm";
import ResetPasswordForm from "components/Login/ResetPasswordForm";
import ResetRequestForm from "components/Login/ResetRequestForm";
import ResetSuccess from "components/Login/ResetSuccess";
import Card from "components/ui/card";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const renderStep = useCallback((step: number) => {
    switch (step) {
      case 0:
        return <ResetRequestForm handleNext={handleNextStep} />;

      case 1:
        return <OTPForm handleNext={handleNextStep} />;

      case 2:
        return (
          <ResetPasswordForm
            handleNext={handleNextStep}
            handleBack={() => setStep((prev) => prev - 1)}
          />
        );

      case 3:
        return <ResetSuccess />;
    }
  }, []);

  return (
    <div className="main-container grid h-[95vh] grid-cols-1 items-center gap-10 py-10 md:gap-[99px] md:px-[86px] lg:grid-cols-2">
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

      <Card className="flex h-full max-h-[838px] items-center px-10 py-24">
        <div className="mx-auto w-full max-w-[400px] space-y-5">
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

export default ForgotPasswordPage;
