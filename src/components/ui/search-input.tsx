import Input from "./input";
import { TextFieldProps } from "@mui/material";
import search from "../../assets/images/icons/search.svg";
import close from "../../assets/images/icons/close.svg";
import darkClose from "../../assets/images/icons/dark-close.svg";
import darkSearch from "../../assets/images/icons/dark-search.svg";

type IProps = TextFieldProps & {
  dark?: boolean;

  onClear?: () => void;
};

const SearchInput = ({ dark, onClear, ...props }: IProps) => {
  return (
    <div className="relative flex items-center flex-shrink-0">
      <img
        alt="search"
        src={dark ? darkSearch : search}
        className="absolute left-4 top-[18px]"
      />

      <Input
        noHelperText
        dark={dark}
        {...props}
        placeholder={props.placeholder || "Search"}
        type="search"
      />

      {!!props.value && (
        <button
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
