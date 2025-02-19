import { TextFieldProps } from "@mui/material";
import classNames from "classnames";
import { HiSearch, HiX } from "react-icons/hi";

import { cn } from "lib/utils";

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
        <HiSearch
          className={cn("h-auto w-[15px]", dark ? "fill-black" : "fill-white")}
        />
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
          <HiX
            className={cn(
              "absolute right-[15.33px] w-[15px]",
              dark ? "fill-black" : "fill-white"
            )}
          />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
