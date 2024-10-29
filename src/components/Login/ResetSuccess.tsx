import React from "react";
import Button from "../ui/button";
import { useNavigate } from "react-router-dom";

const ResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-10">
      <div>
        <p className="text-[24px] md:text-[32px]">Password reset!</p>
        <p className="text-[14px] md:text-[18px]">
          Your password has been successfully reset. Click below to log in
          magically.
        </p>
      </div>
      <Button onClick={() => navigate("/users")} fullWidth>
        Continue
      </Button>
    </div>
  );
};

export default ResetSuccess;
