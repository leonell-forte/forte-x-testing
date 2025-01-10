import { useQuery } from "@tanstack/react-query";
import authService from "api/auth";
import { ReactNode } from "react";

import { ScrollArea } from "components/ui/scroll-area/ScrollArea";
import Spinner from "components/ui/spinner/spinner";

import Header from "../Layout/Header/Header";
import SidePanel from "../Layout/SidePanel/SidePanel";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],

    queryFn: authService.getProfile,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ScrollArea>
      <div className="flex h-screen w-screen flex-col">
        <Header user={user} />

        <div className="flex flex-1 gap-4 px-5 pb-4">
          <SidePanel />

          <div className="relative w-full flex-1 overflow-hidden rounded-[10px] bg-white bg-opacity-[30%] p-[17px]">
            {children}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default DashboardLayout;
