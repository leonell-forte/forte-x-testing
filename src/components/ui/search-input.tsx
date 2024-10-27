import React from "react";
import Input from "./input";
import { TextFieldProps } from "@mui/material";
import Image from "next/image";

const SearchInput = ({ ...props }: TextFieldProps) => {
  return (
    <div className="relative flex items-center">
      <Image
        width={17.49}
        height={17.49}
        alt="search"
        src="/images/icons/search.svg"
        className="absolute left-4"
      />
      <Input {...props} placeholder="Search" type="search" />
    </div>
  );
};

export default SearchInput;
