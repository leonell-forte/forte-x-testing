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

        "!rounded-[30px] bg-white bg-opacity-[30%]"
      )}
    >
      {children}
    </div>
  );
};

export default Card;
