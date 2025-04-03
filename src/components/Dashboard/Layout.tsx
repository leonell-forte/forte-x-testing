import { Outlet } from "react-router-dom";

import { ScrollArea } from "components/ui/scroll-area/ScrollArea";

import Header from "../Layout/Header/Header";
import SidePanel from "../Layout/SidePanel/SidePanel";

const Layout = () => {
  return (
    <ScrollArea>
      <div className="flex min-h-screen w-screen flex-col">
        <Header />

        <div className="flex h-full flex-1 flex-grow gap-4 px-5 pb-4">
          <SidePanel />

          <div className="relative flex-1 rounded-[16px] bg-panel px-8 py-6">
            <Outlet />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Layout;
