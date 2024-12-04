import UserDropdown from "./UserDropdown";
import SearchInput from "../../../components/ui/search-input";
import { Link } from "react-router-dom";
import menu from "../../../assets/images/icons/menu.svg";
import { useAppDispatch, usePageTitle } from "../../../lib/hooks";
import { setShowSidePanel } from "../../../lib/slice/layout";
import { IUser } from "../../../lib/types/users";

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
    <div className="px-5 md:px-[30px] flex items-center justify-between w-screen py-[22px]">
      <div className="flex items-center gap-[70px]">
        <button
          onClick={handleClick}
          className="w-7 h-7 md:hidden"
        >
          <img
            src={menu}
            alt="menu"
          />
        </button>

        <Link to="/users">
          <img
            alt="logo"
            src="/logo.png"
            className="max-w-[98px]"
          />
        </Link>
        {pageTitle && (
          <p className="text-[28px] font-semibold hidden lg:block truncate max-w-[400px] xl:max-w-[600px]">
            {pageTitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 w-full justify-end">
        <SearchInput className="!hidden sm:!block md:w-[286px] flex-shrink-0" />

        <UserDropdown user={user} />
      </div>
    </div>
  );
};

export default Header;
