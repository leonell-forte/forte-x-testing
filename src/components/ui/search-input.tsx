import { TextFieldProps } from "@mui/material";
import classNames from "classnames";

import close from "assets/images/icons/close.svg";
import darkClose from "assets/images/icons/dark-close.svg";
import darkSearch from "assets/images/icons/dark-search.svg";
import search from "assets/images/icons/search.svg";

import Input from "./input";

type IProps = TextFieldProps & {
  dark?: boolean;

  onClear?: () => void;

  containerClass?: string;
};

const SearchInput = ({ dark, onClear, containerClass, ...props }: IProps) => {
  return (
    <div
      className={classNames(
        "relative flex flex-shrink-0 items-center",
        containerClass
      )}
    >
      <button
        type="submit"
        className="absolute left-4 z-10"
        disabled={!props.value}
      >
        <img alt="search" src={dark ? darkSearch : search} />
      </button>

      <Input
        dark={dark}
        placeholder={props.placeholder || "Search"}
        type="search"
        {...props}
      />

      {!!props.value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClear?.();
          }}
          className="flex items-center justify-center"
        >
          <img
            alt="search"
            src={dark ? darkClose : close}
            className="absolute right-[15.33px]"
          />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
