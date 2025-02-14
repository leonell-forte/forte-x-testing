import skills from "assets/images/signup/spot-future-skills.png";

import SignupForm from "components/Signup/SignupForm";
import Card from "components/ui/card";

const SignupPage = () => {
  const handleNextStep = (path?: string) => {
    window.location.href = path || "/beneficiaries";
  };

  return (
    <div className="main-container grid h-[95vh] grid-cols-1 items-center gap-10 py-10 md:gap-[99px] md:px-[86px] lg:grid-cols-2">
      <div className="hidden lg:block">
        <div className="mx-auto h-auto w-auto max-w-[437px] md:mx-0">
          <img alt="jobs" src={skills} />
        </div>

        <div className="space-y-6 text-center md:text-left">
          <p className="font-famaime text-[40px] leading-[110%] md:text-[52px]">
            Unlocking Human <br /> Potential
          </p>

          <p className="text-[18px] leading-[110%] md:text-[24px]">
            We’re building a future of work that works for everyone <br />- by
            funding effective training at no cost to students, and no risk to
            governments.
          </p>
        </div>
      </div>

      <Card className="flex h-fit items-center px-10 py-12 md:py-[74px]">
        <div className="mx-auto w-full max-w-[400px] space-y-12">
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
