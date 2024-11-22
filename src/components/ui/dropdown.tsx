import classNames from "classnames";
import { InputHTMLAttributes, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOutsideClick } from "../../lib/hooks";
import arrow from "../../assets/images/icons/chevron.svg";
import Checkbox from "./checkbox";
import Loader from "./spinner/spinner";
import SearchInput from "./search-input";
import Tag from "./tag";

interface IOption {
  label: string;

  value: string;
}

interface IDropdownProp extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;

  options: IOption[];

  value?: string | string[];

  handleSelect?: (value: string | string[]) => void;

  isMultiSelect?: boolean;

  loading?: boolean;

  error?: boolean;

  helperText?: string;

  noHelperText?: boolean;

  showAsTags?: boolean;
}

const Dropdown = ({
  className,

  options,

  handleSelect,

  isMultiSelect,

  loading,

  error,

  helperText,

  noHelperText,

  showAsTags,

  ...props
}: IDropdownProp) => {
  const [showList, setShowList] = useState(false);

  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setShowList(false));

  const displayValue =
    isMultiSelect && Array.isArray(props.value)
      ? props.value.length
        ? `${props.value.length} selected`
        : ""
      : (props.value as string);

  const optionList = useMemo(
    () =>
      options.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, options],
  );

  return (
    <div
      className={classNames(
        "w-full relative",
        className,
        !noHelperText && "pb-5",
      )}
    >
      <div
        ref={dropdownRef}
        className={classNames(
          "relative h-[50px] w-full cursor-pointer rounded-[8px] border border-white",
          className,
          error && "!border-[#e61a1a]",
          showAsTags && "!h-fit",
        )}
      >
        <button
          disabled={props.disabled}
          type="button"
          onClick={() => setShowList((prev) => !prev)}
          className={classNames(
            "w-full px-4 flex items-center justify-between relative h-full min-h-[50px] outline-none",
            showAsTags && "!items-start py-[9px]",
          )}
        >
          {showAsTags && isMultiSelect ? (
            <div className="flex flex-wrap gap-2 max-w-[95%]">
              {props.value?.length ? (
                (props.value as string[]).map((item, index) => {
                  return (
                    <Tag
                      handleRemove={(e) => {
                        e.stopPropagation();

                        handleSelect!(
                          (props.value as string[]).filter(
                            (val) => val !== item,
                          ),
                        );
                      }}
                      key={index}
                      label={item}
                    />
                  );
                })
              ) : (
                <input
                  className="bg-transparent border-none outline-none w-[90%] placeholder:text-white/50 pointer-events-none"
                  type="text"
                  {...props}
                />
              )}
            </div>
          ) : (
            <input
              type="text"
              className={classNames(
                "bg-transparent border-none outline-none w-[90%] placeholder:text-white/50 pointer-events-none disabled:text-white",
                error && "placeholder:!text-[#fff]/50",
              )}
              {...props}
              value={displayValue}
              readOnly
            />
          )}

          <div className="absolute right-3 top-[20px]">
            <img
              alt="arrow"
              src={arrow}
            />
          </div>
        </button>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={showList ? { opacity: 1 } : { opacity: 0, display: "none" }}
          transition={{ type: "spring", duration: 0.2, bounce: 0 }}
          className="absolute space-y-2 top-[55px] left-0 rounded-[4px] min-w-[300px] bg-white/90 p-2.5 w-full overflow-hidden shadow-md z-10 h-[400px] hide-scroll overflow-y-scroll"
        >
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            dark
          />

          <div>
            {loading ? (
              <div className="w-full h-[100px] flex items-center justify-center">
                <Loader dark />
              </div>
            ) : (
              optionList.map((item, index) => {
                const { label, value } = item;

                return isMultiSelect ? (
                  <div
                    key={index}
                    className="py-1.5 px-2.5"
                  >
                    <Checkbox
                      checked={props?.value?.includes(value)}
                      onChange={() => {
                        let newValue;
                        if (props.value?.includes(value)) {
                          newValue = (props.value as string[]).filter(
                            (item) => item !== value,
                          );
                        } else {
                          newValue = [...(props.value as string[]), value];
                        }
                        handleSelect!(newValue);
                      }}
                      dark
                      label={label}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleSelect!(value);
                      setShowList(false);
                    }}
                    key={index}
                    className="w-full text-left"
                  >
                    <li className="text-black font-medium py-3 px-4 hover:bg-mint rounded-[8px] transition-all">
                      {label}
                    </li>
                  </button>
                );
              })
            )}
          </div>
        </motion.ul>
      </div>

      {helperText && (
        <div className="pl-4 pt-1 absolute">
          <p className="text-[#e61a1a] text-[12px]">{helperText}</p>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
