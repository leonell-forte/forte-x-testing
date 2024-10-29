import UserDropdown from "./UserDropdown";
import SearchInput from "../../../components/ui/search-input";

const Header = () => {
  return (
    <div className="h-[80px]  px-5 md:px-[30px] flex items-center justify-between">
      <img alt="logo" src="/logo.png" className="max-w-[98px]" />
      <div className="flex items-center gap-4">
        <SearchInput className="md:w-[286px]" />
        <UserDropdown />
      </div>
    </div>
  );
};

export default Header;
