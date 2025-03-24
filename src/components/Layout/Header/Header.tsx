import { RxHamburgerMenu as Burger } from "react-icons/rx";
import { Link } from "react-router-dom";

import { REDIRECT_PATHS } from "lib/constants";
import { useAppDispatch } from "lib/hooks";
import { setShowSidePanel } from "lib/slice/layout";

import { useProfile } from "components/ProfileContext";
import { BreadCrumbs } from "components/ui/breadcrumb/Breadcrumb";

import { SearchConsoleMarker } from "./SearchConsole";
import UserDropdown from "./UserDropdown";

const Header = () => {
  const { profile } = useProfile();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setShowSidePanel(true));
  };

  return (
    <div className="flex w-screen items-center justify-between gap-4 px-5 pb-[18px] pt-[18px] lg:px-5 lg:pt-[15px]">
      <div className="flex items-center justify-start gap-2 lg:ml-4 lg:items-end lg:gap-x-[142px]">
        <button onClick={handleClick} className="lg:hidden">
          <Burger className="h-auto w-6" />
        </button>

        <Link to={REDIRECT_PATHS[profile.role!]}>
          <img
            alt="logo"
            src="/logo.png"
            className="hidden max-w-[98px] lg:block"
          />
        </Link>
        <BreadCrumbs />
      </div>

      <div className="flex w-full items-end justify-end gap-4 lg:mt-2.5">
        <SearchConsoleMarker />

        <UserDropdown />
      </div>
    </div>
  );
};

export default Header;
