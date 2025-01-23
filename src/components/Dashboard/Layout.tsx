import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

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
  const publicRoutes = ["/", "/signup", "/forgot-password"];

  const { pathname } = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ScrollArea>
      {!publicRoutes.includes(pathname) ? (
        <div className="flex h-screen w-screen flex-col">
          <Header user={user!} />

          <div className="flex flex-1 gap-4 px-5 pb-4">
            <SidePanel role={user!.role} />

            <div className="relative w-full flex-1 overflow-hidden rounded-[10px] bg-white bg-opacity-[30%] p-[17px]">
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </ScrollArea>
  );
};

export default Layout;
