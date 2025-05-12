import React from "react";
import { RiShareBoxLine as Share } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { cn } from "lib/utils";

type Props = {
  hrefLink: string;
  children: React.ReactNode;
};

function ReferenceLink({ children, hrefLink }: Props) {
  const navigate = useNavigate();
  const ariaLabel =
    typeof children === "string"
      ? `Navigate to ${children}`
      : "Navigate to reference page";
  return (
    <button
      className={cn(
        "group flex items-center gap-x-2 transition hover:text-mint",
        "focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-1",
        "transition-all duration-200"
      )}
      onClick={(e) => {
        e.stopPropagation();
        navigate(hrefLink);
      }}
      role="link"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {children}
      <Share className="fill-mint" />
    </button>
  );
}

export default ReferenceLink;
