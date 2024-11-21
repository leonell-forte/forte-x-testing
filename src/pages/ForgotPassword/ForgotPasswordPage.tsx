import Card from "../../components/ui/card";
import jobs from "../../assets/images/login/spot-choiceofjobs.png";
import ResetRequestForm from "../../components/Login/ResetRequestForm";
import { useCallback, useState } from "react";
import OTPForm from "../../components/Login/OTPForm";
import ResetPasswordForm from "../../components/Login/ResetPasswordForm";
import ResetSuccess from "../../components/Login/ResetSuccess";

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
    <div className="main-container grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-[99px] items-center h-[95vh] md:px-[86px]">
      <div className="hidden lg:block">
        <div className="max-w-[437px] w-auto h-auto mx-auto md:mx-0">
          <img
            alt="jobs"
            src={jobs}
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
          <img
            alt="logo"
            src="/logo.png"
            className="w-auto h-auto mx-auto max-w-[122px]"
          />

          {renderStep(step)}
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
