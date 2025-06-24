import React from "react";
import { Link } from "react-router-dom";

import LinkIcon from "@/assets/images/icons/link.svg?react";

type ContentProps = {
  label: string;
  value: string;
  link?: string;
};

const Details = {
  Container: (props: React.PropsWithChildren) => {
    return (
      // <div className="flex gap-11 rounded-3 border border-white/30 px-6 py-4">
      <div className="rounded-3 grid grid-cols-3 gap-6 border border-white/30 p-6">
        {props.children}
      </div>
    );
  },

  Content: (props: ContentProps) => {
    return (
      <div className="w-full space-y-2">
        <p className="text-[12px] font-light">{props.label}</p>
        <div className="flex items-center gap-2.5">
          <p className="font-light text-neutral-100">{props.value}</p>
          {props.link && (
            <Link to={props.link} className="link">
              <LinkIcon />
            </Link>
          )}
        </div>
      </div>
    );
  },
};

export default Details;
