import { FaQuestion } from "react-icons/fa6";
import { RxHamburgerMenu as Burger } from "react-icons/rx";
import { Link } from "react-router-dom";

import { REDIRECT_PATHS } from "lib/constants";
import { useAppDispatch } from "lib/hooks";
import { setShowSidePanel } from "lib/slice/layout";

import { useProfile } from "components/ProfileContext";
import { BreadCrumbs } from "components/ui/breadcrumb/Breadcrumb";
import { Tooltip } from "components/ui/tooltip/Tooltip";

import { SearchConsoleMarker } from "./SearchConsole";
import UserDropdown from "./UserDropdown";
import { showGetHelpModal } from "./modals/GetHelp";

const Header = () => {
  const { profile } = useProfile();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setShowSidePanel(true));
  };

  return (
    <div className="grid w-screen grid-cols-[20px_1fr] items-center justify-between gap-4 px-5 pb-[18px] pt-[18px] lg:grid-cols-[242px_1fr] lg:px-5 lg:pt-[15px]">
      <div className="flex items-center justify-start gap-2 lg:ml-4 lg:items-end lg:gap-x-[142px]">
        <button onClick={handleClick} className="lg:hidden">
          <Burger className="h-auto w-6" />
        </button>

        <Link to={REDIRECT_PATHS[profile.role!]}>
          <img
            alt="forte logo"
            src="/logo.png"
            className="hidden max-w-[98px] lg:block"
          />
        </Link>
      </div>

      <div className="flex items-center justify-between gap-x-6">
        <div className="w-full flex-1">
          <BreadCrumbs />
        </div>

        <div className="flex items-center justify-end gap-4 lg:mt-2.5">
          <div className="hidden lg:block">
            <SearchConsoleMarker />
          </div>
          <Tooltip title="Support">
            <button
              type="button"
              onClick={() => showGetHelpModal()}
              className="group rounded-full bg-white p-1 transition hover:bg-mint"
            >
              <FaQuestion className="h-auto w-4 fill-mint transition group-hover:fill-white" />
            </button>
          </Tooltip>

          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default Header;
