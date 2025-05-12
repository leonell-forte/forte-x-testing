import { useQuery } from "@tanstack/react-query";
import authService from "api/auth";
import { useCallback, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { cookie } from "lib/hooks";

import LoginForm from "components/Login/LoginForm";
import OTPForm from "components/Login/OTPForm";
import Card from "components/ui/card";

const Login = () => {
  const { data } = useQuery({
    queryKey: ["login-copy"],
    queryFn: authService.getLoginCopy,
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
          return (
            <LoginForm
              handleNext={handleNextStep} // remove OTP form temporarily
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

  return (
    <main
      className="main-container grid min-h-screen grid-cols-1 items-center gap-12 px-10 lg:grid-cols-2 lg:py-10 xl:gap-[70px]"
      role="main"
    >
      {/* Hero Section */}
      <section className="hidden lg:block" aria-label="Welcome Section">
        <div className="mx-auto h-auto w-auto max-w-[437px] md:mx-0">
          {data?.image && (
            <img src={data?.image.url} alt="Login illustration" />
          )}
        </div>

        <div
          className="max-w-xs space-y-6 text-center md:max-w-full md:text-left"
          role="contentinfo"
        >
          <h1 className="font-famaime text-[40px] leading-[110%] md:text-[52px]">
            {data?.title}
          </h1>

          <p
            className="text-[18px] leading-[110%] md:text-[20px]"
            aria-label={data?.description}
          >
            {data?.description}
          </p>
        </div>
      </section>

      {/* Form Card Section */}
      <section aria-label="Registration Form">
        <Card className="mx-auto flex min-h-screen w-full items-center px-4 pb-24 pt-4 md:px-10 md:pt-24 lg:min-h-[838px] lg:w-full lg:max-w-[580px] lg:pt-12">
          <div className="mx-auto w-full max-w-[350px] space-y-5 md:max-w-[450px]">
            <div role="banner">
              <img
                src="/logo.png"
                alt="Forte Logo"
                className="mx-auto h-auto w-auto max-w-[122px]"
              />
            </div>

            {/* Form Steps */}
            <div role="form" aria-label={`Registration Step ${step}`}>
              {renderStep(step)}
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
};

const LoginPage = () => {
  const token = cookie.get("access_token");
  if (token) return <Navigate to="/beneficiaries" />;
  return <Login />;
};

export default LoginPage;
