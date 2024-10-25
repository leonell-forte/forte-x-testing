import Image from "next/image";
import React from "react";
import Input from "../../ui/input";
import UserDropdown from "./UserDropdown";
import SearchInput from "@/components/ui/search-input";

const Header = () => {
  return (
    <div className="h-[80px] md:px-[30px] flex items-center justify-between">
      <Image width={100} height={100} alt="logo" src="/logo.png" />
      <div className="flex items-center gap-4">
        <SearchInput className="md:w-[286px]" />
        <UserDropdown />
      </div>
    </div>
  );
};

export default Header;
