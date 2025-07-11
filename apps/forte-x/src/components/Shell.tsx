import { Outlet } from "react-router-dom";

// import { ModeToggle } from "./mode-toggle";

const Shell = () => {
  return (
    <div className="relative">
      {/* <div className="absolute right-9 top-4">
        <ModeToggle />
      </div> */}
      <Outlet />
    </div>
  );
};

export default Shell;
