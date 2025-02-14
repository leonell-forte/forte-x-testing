import skills from "assets/images/signup/spot-future-skills.png";

import SignupForm from "components/Signup/SignupForm";
import Card from "components/ui/card";

const SignupPage = () => {
  const handleNextStep = (path?: string) => {
    window.location.href = path || "/beneficiaries";
  };

  return (
    <div className="main-container grid min-h-screen grid-cols-1 items-center gap-12 px-10 lg:grid-cols-2 lg:py-10 xl:gap-[70px]">
      <div className="hidden lg:block">
        <div className="mx-auto h-auto w-auto max-w-[437px] md:mx-0">
          <img alt="jobs" src={skills} />
        </div>

        <div className="max-w-xs space-y-6 text-center md:max-w-full md:text-left">
          <p className="font-famaime text-[40px] leading-[110%] md:text-[52px]">
            World-class workforce development made simple.
          </p>

          <p className="text-[18px] leading-[110%] md:text-[20px]">
            We’re building a future of work that works for everyone <br />- by
            funding effective training at no cost to students, and no risk to
            governments.
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
