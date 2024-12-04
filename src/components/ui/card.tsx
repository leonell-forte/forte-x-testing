import classNames from "classnames";
import React, { ReactNode } from "react";

interface ICardProp {
  children: ReactNode;
  className?: string;
}

const Card = ({ className, children }: ICardProp) => {
  return (
    <div
      className={classNames(
        className,

        "bg-white bg-opacity-[30%] !rounded-[30px]",
      )}
    >
      {children}
    </div>
  );
};

export default Card;
