import { RxHamburgerMenu as Burger } from "react-icons/rx";
import { Link } from "react-router-dom";

import { useAppDispatch, usePageTitle } from "lib/hooks";
import { setShowSidePanel } from "lib/slice/layout";
import { ProfileType } from "lib/types/profile";

import { SearchConsoleMarker } from "./SearchConsole";
import UserDropdown from "./UserDropdown";

interface IProp {
  user: ProfileType;
}

const Header = ({ user }: IProp) => {
  const dispatch = useAppDispatch();

  const { pageTitle } = usePageTitle();

  const handleClick = () => {
    dispatch(setShowSidePanel(true));
  };

  return (
    <div className="flex w-screen items-center justify-between gap-4 px-5 pb-[18px] pt-[18px] lg:px-5 lg:pt-[15px]">
      <div className="flex items-center justify-start gap-2 lg:ml-4 lg:items-end lg:gap-20">
        <button onClick={handleClick} className="lg:hidden">
          <Burger className="h-auto w-6" />
        </button>

        <Link to="/users">
          <img
            alt="logo"
            src="/logo.png"
            className="hidden max-w-[98px] lg:block"
          />
        </Link>
        {pageTitle && (
          <p className="-my-2 max-w-[400px] truncate text-2xl font-[450] lg:text-3xl xl:max-w-[600px]">
            {pageTitle}
          </p>
        )}
      </div>

      <div className="flex w-full items-end justify-end gap-4 lg:mt-2.5">
        <SearchConsoleMarker />

        <UserDropdown user={user} />
      </div>
    </div>
  );
};

export default Header;
