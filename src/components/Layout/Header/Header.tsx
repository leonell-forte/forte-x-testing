import { Link } from "react-router-dom";

import menu from "assets/images/icons/menu.svg";

import { useAppDispatch, usePageTitle } from "lib/hooks";
import { setShowSidePanel } from "lib/slice/layout";
import { IUser } from "lib/types/users";

import SearchInput from "components/ui/search-input";

import UserDropdown from "./UserDropdown";

interface IProp {
  user: IUser;
}

const Header = ({ user }: IProp) => {
  const dispatch = useAppDispatch();

  const { pageTitle } = usePageTitle();

  const handleClick = () => {
    dispatch(setShowSidePanel(true));
  };

  return (
    <div className="flex w-screen items-center justify-between px-5 py-[22px] md:px-[30px]">
      <div className="flex items-center gap-[70px]">
        <button onClick={handleClick} className="h-7 w-7 md:hidden">
          <img src={menu} alt="menu" />
        </button>

        <Link to="/users">
          <img alt="logo" src="/logo.png" className="max-w-[98px]" />
        </Link>
        {pageTitle && (
          <p className="hidden max-w-[400px] truncate text-[28px] font-semibold lg:block xl:max-w-[600px]">
            {pageTitle}
          </p>
        )}
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <SearchInput className="!hidden flex-shrink-0 sm:!block md:w-[286px]" />

        <UserDropdown user={user} />
      </div>
    </div>
  );
};

export default Header;
