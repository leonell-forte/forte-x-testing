import UserDropdown from "./UserDropdown";
import SearchInput from "../../../components/ui/search-input";
import { Link } from "react-router-dom";
import menu from "../../../assets/images/icons/menu.svg";
import { useAppDispatch } from "../../../lib/hooks";
import { setShowSidePanel } from "../../../lib/slice/layout";
import { IUser } from "../../../lib/types/users";

interface IProp {
  user: IUser;
}

const Header = ({ user }: IProp) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setShowSidePanel(true));
  };

  return (
    <div className="h-[80px] px-5 md:px-[30px] flex items-center justify-between">
      <div className="flex items-center gap-4">
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
      </div>

      <div className="flex items-center gap-4">
        <SearchInput className="!hidden sm:!block md:w-[286px]" />

        <UserDropdown user={user} />
      </div>
    </div>
  );
};

export default Header;
