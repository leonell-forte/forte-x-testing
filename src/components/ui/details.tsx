import React from "react";

type ContentProps = {
  label: string;
  value: string;
};

const Details = {
  Container: (props: React.PropsWithChildren) => {
    return (
      <div className="rounded-3 flex gap-11 border border-white/30 px-6 py-4">
        {props.children}
      </div>
    );
  },

  Content: (props: ContentProps) => {
    return (
      <div className="w-full space-y-2">
        <p className="text-[12px] font-light">{props.label}</p>
        <p className="font-light">{props.value}</p>
      </div>
    );
  },
};

export default Details;
