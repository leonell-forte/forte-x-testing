import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "lib/utils";

function AlertIcon() {
  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-[#4A1515]">
      <span className="font-bold text-white">!</span>
    </div>
  );
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    className={cn(
      "z-50 max-w-[18.75rem] overflow-hidden rounded border-transparent bg-white px-4 py-2.5 text-black transition-all animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    sideOffset={10}
    arrowPadding={15}
    {...props}
  >
    {children}
    <TooltipPrimitive.Arrow
      className="border-none fill-white"
      width={15}
      height={7}
    />
  </TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

type TMainProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "right" | "bottom" | "left";
  offset?: "center" | "end" | "start";
  title?: React.ReactNode;
  open?: boolean;
} & React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>;

const Tooltip = ({
  content,
  children,
  position = "bottom",
  offset = "center",
  ...props
}: TMainProps) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={300} {...props}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipContent side={position} align={offset}>
          <div className="flex flex-col gap-[0.5rem]">
            <div className="flex items-center gap-1.5">
              <AlertIcon />
              <div className="flex-1 text-sm text-black">{content}</div>
            </div>
          </div>
        </TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;
