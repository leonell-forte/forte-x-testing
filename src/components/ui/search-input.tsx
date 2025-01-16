import { TextFieldProps } from "@mui/material";

import close from "assets/images/icons/close.svg";
import darkClose from "assets/images/icons/dark-close.svg";
import darkSearch from "assets/images/icons/dark-search.svg";
import search from "assets/images/icons/search.svg";

import Input from "./input";

type IProps = TextFieldProps & {
  dark?: boolean;

  onClear?: () => void;
};

const SearchInput = ({ dark, onClear, ...props }: IProps) => {
  return (
    <div className="relative flex flex-shrink-0 items-center">
      <button
        type="submit"
        className="absolute left-4 top-[16px] z-10"
        disabled={!props.value}
      >
        <img alt="search" src={dark ? darkSearch : search} />
      </button>

      <Input
        noHelperText
        dark={dark}
        {...props}
        placeholder={props.placeholder || "Search"}
        type="search"
      />

      {!!props.value && (
        <button
          type="button"
          onClick={onClear}
          className="flex items-center justify-center"
        >
          <img
            alt="search"
            src={dark ? darkClose : close}
            className="absolute right-[15.33px] top-[19.8px]"
          />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
