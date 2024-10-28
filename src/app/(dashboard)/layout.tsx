import Header from "@/components/Layout/Header/Header";
import SidePanel from "@/components/Layout/SidePanel/SidePanel";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="space-y-5 min-h-screen">
      <Header />
      <div className="px-5 flex gap-4 h-[88vh]">
        <SidePanel />
        <div className="w-full bg-white bg-opacity-[30%] rounded-[10px] py-[7px] px-[14px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
