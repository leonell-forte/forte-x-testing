import { TextFieldProps } from "@mui/material";
import classNames from "classnames";
import { HiSearch, HiX } from "react-icons/hi";

import { cn } from "lib/utils";

import InfoTooltip from "./info-tooltip";
import Input from "./input";

type IProps = TextFieldProps & {
  dark?: boolean;

  onClear?: () => void;

  containerClass?: string;

  tooltip?: string;
};

const SearchInput = ({
  dark,
  onClear,
  containerClass,
  tooltip,
  ...props
}: IProps) => {
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

      <div className="absolute right-[15.33px]">
        {props.value ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear?.();
            }}
            className="flex items-center justify-center"
          >
            <HiX
              className={cn("w-[15px]", dark ? "fill-black" : "fill-white")}
            />
          </button>
        ) : (
          tooltip && <InfoTooltip tooltip={tooltip} />
        )}
      </div>
    </div>
  );
};

export default SearchInput;
