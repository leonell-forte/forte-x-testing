import { ReactNode } from "react";
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
    <div className="h-screen overflow-y-scroll w-screen overflow-x-hidden">
      <Header user={user} />

      <div className="px-5 flex gap-4 min-h-[88vh] pb-4 w-screen overflow-scroll">
        <SidePanel />

        <div className="relative bg-white bg-opacity-[30%] rounded-[10px] p-[17px] w-full min-w-[1024px] hide-scroll overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
