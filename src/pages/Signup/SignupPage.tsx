import { useQuery } from "@tanstack/react-query";
import authService from "api/auth";

import SignupForm from "components/Signup/SignupForm";
import Card from "components/ui/card";

const SignupPage = () => {
  const { data } = useQuery({
    queryKey: ["signup-copy"],
    queryFn: authService.getSignupCopy,
  });

  const handleNextStep = (path?: string) => {
    window.location.href = path || "/beneficiaries";
  };

  return (
    <div className="main-container grid min-h-screen grid-cols-1 items-center gap-12 px-10 lg:grid-cols-2 lg:py-10 xl:gap-[70px]">
      <div className="hidden lg:block">
        <div className="mx-auto h-auto w-auto max-w-[437px] md:mx-0">
          <img alt="jobs" src={data?.image.url} />
        </div>

        <div className="max-w-xs space-y-6 text-center md:max-w-full md:text-left">
          <p className="font-famaime text-[40px] leading-[110%] md:text-[52px]">
            {data?.title}{" "}
          </p>

          <p className="text-[18px] leading-[110%] md:text-[20px]">
            {data?.description}
          </p>
        </div>
      </div>

      <Card className="mx-auto flex h-full w-full items-center px-4 py-8 md:px-10 lg:w-full lg:max-w-[580px]">
        <div className="mx-auto w-full max-w-[350px] space-y-5 md:max-w-[450px]">
          <img
            alt="logo"
            src="/logo.png"
            className="mx-auto h-auto w-auto max-w-[122px]"
          />

          <SignupForm handleNext={handleNextStep} />
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
