import React from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetRequest } from "../../lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ILoginProps } from "./types";

const ResetRequestForm = ({ handleNext }: ILoginProps) => {
  const navigate = useNavigate();

  const {
    handleSubmit,

    formState: { errors },

    setValue,
  } = useForm<z.infer<typeof resetRequest.schema>>({
    resolver: zodResolver(resetRequest.schema),

    defaultValues: resetRequest.defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof resetRequest.schema>) => {
    console.log(values);

    handleNext!();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-center space-y-12">
      <div className="space-y-4">
        <div>
          <p className="text-[24px] md:text-[32px] font-medium">
            Reset password
          </p>

          <p className="text-[18px]">
            Forgot your password? Enter your email and we’ll send you a 4-digit
            code.
          </p>
        </div>

        <Input
          onChange={(e) => setValue("email", e.target.value)}
          helperText={errors.email?.message}
          error={!!errors.email?.message}
          label="Enter your email"
        />
      </div>

      <div className="flex flex-col gap-4">
        <Button type="submit">Get 4-digit code</Button>

        <Button buttonType="tertiary" onClick={() => navigate("/")}>
          Go back
        </Button>
      </div>
    </form>
  );
};

export default ResetRequestForm;
