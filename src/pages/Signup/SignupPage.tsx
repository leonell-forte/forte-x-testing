import SignupForm from "../../components/Signup/SignupForm";
import Card from "../../components/ui/card";
import skills from "../../assets/images/signup/spot-future-skills.png";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleNextStep = () => {
    navigate("/users");
  };

  return (
    <div className="main-container grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-[99px] items-center h-[95vh] md:px-[86px]">
      <div className="hidden lg:block">
        <div className="max-w-[437px] w-auto h-auto mx-auto md:mx-0">
          <img
            alt="jobs"
            src={skills}
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
          <img
            alt="logo"
            src="/logo.png"
            className="w-auto h-auto mx-auto max-w-[122px]"
          />

          <SignupForm handleNext={handleNextStep} />
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
