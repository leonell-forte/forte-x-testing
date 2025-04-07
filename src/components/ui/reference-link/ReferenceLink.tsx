import React from "react";
import { RiShareBoxLine as Share } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

type Props = {
  hrefLink: string;
  children: React.ReactNode;
};

function ReferenceLink({ children, hrefLink }: Props) {
  const navigate = useNavigate();
  return (
    <button
      className="group flex items-center gap-x-2 transition hover:text-mint"
      onClick={(e) => {
        e.stopPropagation();
        navigate(hrefLink);
      }}
    >
      {children}
      <Share className="fill-mint" />
    </button>
  );
}

export default ReferenceLink;
