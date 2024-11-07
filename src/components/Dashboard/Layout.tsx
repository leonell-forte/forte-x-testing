import React, { ReactNode } from "react";
import Header from "../Layout/Header/Header";
import SidePanel from "../Layout/SidePanel/SidePanel";
import QueryProvider from "../QueryProvider";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <div className="space-y-5 min-h-screen">
        <Header />
        <div className="px-5 flex gap-4 min-h-[88vh] pb-4 overflow-scroll">
          <SidePanel />

          <div className="w-full bg-white bg-opacity-[30%] rounded-[10px] pt-[7px] pb-4 px-[14px] min-w-[1280px]">
            {children}
          </div>
        </div>
      </div>
    </QueryProvider>
  );
};

export default DashboardLayout;
