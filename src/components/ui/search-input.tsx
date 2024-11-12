import Input from "./input";
import { TextFieldProps } from "@mui/material";
import search from "../../assets/images/icons/search.svg";

const SearchInput = ({ ...props }: TextFieldProps) => {
  return (
    <div className="relative flex items-center">
      <img alt="search" src={search} className="absolute left-4" />
      <Input
        {...props}
        placeholder={props.placeholder || "Search"}
        type="search"
      />
    </div>
  );
};

export default SearchInput;
