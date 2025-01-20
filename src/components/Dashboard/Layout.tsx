import { ReactNode } from "react";

import { ProfileType } from "lib/types/profile";

import { ScrollArea } from "components/ui/scroll-area/ScrollArea";
import Spinner from "components/ui/spinner/spinner";

import Header from "../Layout/Header/Header";
import SidePanel from "../Layout/SidePanel/SidePanel";

const DashboardLayout = ({
  children,
  restrictedRoles,
  user,
  isLoading,
}: {
  children: ReactNode;
  restrictedRoles?: string[];
  user?: ProfileType;
  isLoading?: boolean;
}) => {
  if (isLoading || !user) {
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
          <SidePanel role={user.role} />

          <div className="relative w-full flex-1 overflow-hidden rounded-[10px] bg-white bg-opacity-[30%] p-[17px]">
            {children}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default DashboardLayout;
