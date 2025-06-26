import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ICardProp {
  children: ReactNode;
  className?: string;
}

const Card = ({ className, children }: ICardProp) => {
  return (
    <div
      className={cn(
        className,
        "card rounded-0 bg-white/20 shadow backdrop-blur-xl lg:rounded-[30px]"
      )}
      role="region"
    >
      {children}
    </div>
  );
};

export default Card;
