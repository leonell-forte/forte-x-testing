"use client";

import {
  OTPInputContext,
  OTPInput as Prim,
  REGEXP_ONLY_DIGITS,
} from "input-otp";
import { Minus } from "lucide-react";
import * as React from "react";

import { cn } from "lib/utils";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof Prim>,
  React.ComponentPropsWithoutRef<typeof Prim>
>(({ className, containerClassName, ...props }, ref) => (
  <Prim
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mx-auto flex items-center justify-center gap-2 sm:gap-[10px]",
      className
    )}
    {...props}
  />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
  console.log(char);
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex aspect-square h-16 w-16 items-center justify-center rounded-md bg-white bg-opacity-[50%] text-[24px] text-forest-green shadow-sm transition-all md:rounded-xl md:text-[40px]",
        isActive && "z-10 outline-none ring-2 ring-inset ring-white/80",
        char ? "bg-mint" : "bg-white",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-7 w-px animate-caret-blink bg-black duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

export function OTPInput({ onChange }: { onChange: (input: string) => void }) {
  return (
    <InputOTP
      maxLength={6}
      autoFocus
      onChange={onChange}
      inputMode="tel"
      pattern={REGEXP_ONLY_DIGITS}
    >
      <InputOTPGroup>
        {Array.from({ length: 6 }).map((_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
