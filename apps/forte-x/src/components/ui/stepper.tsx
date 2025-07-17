import { cn } from "@repo/ui/lib/utils";
import React from "react";

const Stepper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-[480px] space-y-10 rounded-[30px] border border-gray-400 bg-green-50/50 p-10">
      {children}
    </div>
  );
};

const StepperTitle = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-[14px]">{children}</p>;
};

const StepperList = ({ children }: { children: React.ReactNode }) => {
  return <ul className="space-y-6">{children}</ul>;
};

const StepperTrigger = ({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: string;
}) => {
  return (
    <li>
      <p className={cn("text-lg font-bold")}>{title}</p>
      <p className={cn("text-[14px]")}>{description}</p>
    </li>
  );
};

const StepperContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export { Stepper, StepperList, StepperTrigger, StepperContent, StepperTitle };
