import React, { ReactNode } from "react";
import Header from "../Layout/Header/Header";
import SidePanel from "../Layout/SidePanel/SidePanel";
import { useQuery } from "@tanstack/react-query";
import authService from "../../api/auth";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
  });

  return (
    <div className="space-y-5 min-h-screen">
      <Header user={user} />
      <div className="px-5 flex gap-4 min-h-[88vh] pb-4 overflow-scroll">
        <SidePanel />

        <div className="w-full relative bg-white bg-opacity-[30%] rounded-[10px] pt-[7px] pb-14 px-[14px] min-w-[1280px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
