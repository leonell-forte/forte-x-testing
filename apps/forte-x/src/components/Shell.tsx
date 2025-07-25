import { Outlet } from "react-router-dom";

import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

import { Breadcrumbs } from "./breadcrumbs/Breadcrumbs";
import { ModeToggle } from "./mode-toggle";

const Shell = () => {
  const { showBreadcrumbs } = useBreadcrumbs();

  return (
    <div>
      <div className="h-screen p-10">
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            {showBreadcrumbs ? <Breadcrumbs /> : <div />}
            <ModeToggle />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Shell;
