import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { publicRoutes } from "lib/routes";
import { ProfileType } from "lib/types/profile";

import { ScrollArea } from "components/ui/scroll-area/ScrollArea";
import Spinner from "components/ui/spinner/spinner";

import Header from "../Layout/Header/Header";
import SidePanel from "../Layout/SidePanel/SidePanel";

const Layout = ({
  children,
  user,
  isLoading,
}: {
  children: ReactNode;
  user?: ProfileType;
  isLoading?: boolean;
}) => {
  const { pathname } = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return !publicRoutes.includes(pathname) ? (
    <ScrollArea>
      <div className="flex min-h-screen w-screen flex-col">
        <Header user={user!} />

        <div className="flex flex-grow gap-4 px-5 pb-4">
          <SidePanel />

          <div className="bg-panel relative flex-1 rounded-lg p-[17px]">
            {children}
          </div>
        </div>
      </div>
    </ScrollArea>
  ) : (
    <div>{children}</div>
  );
};

export default Layout;
