import { Link } from "react-router-dom";

import menu from "assets/images/icons/menu.svg";

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
    <div className="flex w-screen items-center justify-between px-5 py-[22px] md:px-[30px]">
      <div className="flex items-center gap-[80px]">
        <button onClick={handleClick} className="h-7 w-7 md:hidden">
          <img src={menu} alt="menu" />
        </button>

        <Link to="/users">
          <img
            alt="logo"
            src="/logo.png"
            className="hidden max-w-[98px] md:block"
          />
        </Link>
        {pageTitle && (
          <p className="hidden max-w-[400px] truncate text-[28px] font-semibold lg:block xl:max-w-[600px]">
            {pageTitle}
          </p>
        )}
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <SearchConsoleMarker />

        <UserDropdown user={user} />
      </div>
    </div>
  );
};

export default Header;
