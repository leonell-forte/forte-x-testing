import { useQuery } from "@tanstack/react-query";
import authService from "api/auth";
import { ReactNode } from "react";

import Header from "../Layout/Header/Header";
import SidePanel from "../Layout/SidePanel/SidePanel";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { data: user } = useQuery({
    queryKey: ["profile"],

    queryFn: authService.getProfile,
  });

  return (
    <div className="h-screen w-screen overflow-x-hidden overflow-y-scroll">
      <Header user={user} />

      <div className="flex min-h-[88vh] w-screen gap-4 overflow-scroll px-5 pb-4">
        <SidePanel />

        <div className="hide-scroll relative w-full min-w-[1024px] overflow-hidden rounded-[10px] bg-white bg-opacity-[30%] p-[17px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
