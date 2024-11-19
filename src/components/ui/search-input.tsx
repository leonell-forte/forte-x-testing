import Input from "./input";
import { TextFieldProps } from "@mui/material";
import search from "../../assets/images/icons/search.svg";
import close from "../../assets/images/icons/close.svg";
import darkSearch from "../../assets/images/icons/dark-search.svg";

type IProps = TextFieldProps & {
  dark?: boolean;
};

const SearchInput = ({ dark, ...props }: IProps) => {
  return (
    <div className="relative flex items-center">
      <img
        alt="search"
        src={dark ? darkSearch : search}
        className="absolute left-4 top-5"
      />

      <Input
        dark={dark}
        {...props}
        placeholder={props.placeholder || "Search"}
        type="search"
      />

      {!!props.value && (
        <img
          alt="search"
          src={close}
          className="absolute right-[15px] top-[22px] pointer-events-none"
        />
      )}
    </div>
  );
};

export default SearchInput;
