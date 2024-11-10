import UserDropdown from "./UserDropdown";
import SearchInput from "../../../components/ui/search-input";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="h-[80px]  px-5 md:px-[30px] flex items-center justify-between">
      <Link to="/users">
        <img alt="logo" src="/logo.png" className="max-w-[98px]" />
      </Link>
      <div className="flex items-center gap-4">
        <SearchInput className="md:w-[286px]" />
        <UserDropdown />
      </div>
    </div>
  );
};

export default Header;
