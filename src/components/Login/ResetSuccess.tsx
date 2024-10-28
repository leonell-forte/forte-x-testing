import React from "react";
import Button from "../ui/button";
import { useRouter } from "next/navigation";

const ResetSuccess = () => {
  const router = useRouter();

  return (
    <div className="text-center space-y-10">
      <div>
        <p className="text-[24px] md:text-[32px]">Password reset!</p>
        <p className="text-[14px] md:text-[18px]">
          Your password has been successfully reset. Click below to log in
          magically.
        </p>
      </div>
      <Button onClick={() => router.push("/users")} fullWidth>
        Continue
      </Button>
    </div>
  );
};

export default ResetSuccess;
