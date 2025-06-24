import { useCallback, useState } from "react";

import jobs from "@/assets/images/login/spot-choiceofjobs.png";
import ResetPasswordForm from "@/components/Login/ResetPasswordForm";
import ResetRequestForm from "@/components/Login/ResetRequestForm";
import ResetSuccess from "@/components/Login/ResetSuccess";
import Card from "@/components/ui/card";

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
        return (
          <ResetPasswordForm
            handleNext={handleNextStep}
            handleBack={() => setStep((prev) => prev - 1)}
          />
        );

      case 2:
        return <ResetSuccess />;
    }
  }, []);

  return (
    <div className="main-container grid min-h-screen grid-cols-1 items-center gap-12 px-10 lg:grid-cols-2 lg:py-10 xl:gap-[70px]">
      <div className="hidden lg:block">
        <div className="mx-auto h-auto w-auto max-w-[437px] md:mx-0">
          <img alt="jobs" src={jobs} />
        </div>

        <div className="max-w-xs space-y-6 text-center md:max-w-full md:text-left">
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

      <Card className="mx-auto flex h-full w-full items-center px-4 pb-24 pt-4 md:px-10 md:pt-24 lg:max-h-[838px] lg:w-full lg:min-w-[580px] lg:max-w-[580px] lg:pt-12">
        <div className="mx-auto w-full max-w-[450px] space-y-12">
          <img
            alt="Forte logo"
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
