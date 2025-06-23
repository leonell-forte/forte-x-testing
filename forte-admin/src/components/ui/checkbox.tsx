import {
  CheckboxProps,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import { ReactNode } from "react";
import { MdCheckBox as Checked } from "react-icons/md";
import { MdCheckBoxOutlineBlank as Unchecked } from "react-icons/md";

import { cn } from "lib/utils";

interface ICheckboxProps extends CheckboxProps {
  label?: string | ReactNode;
  helperText?: string | ReactNode;
  dark?: boolean;
  labelClass?: string;
  white?: boolean;
}

const Checkbox = ({
  label,
  helperText,
  dark,
  labelClass,
  disabled,
  white = false,
  ...props
}: ICheckboxProps) => {
  return (
    <div className="relative pl-[2px]">
      <FormControlLabel
        onClick={(e) => e.stopPropagation()}
        control={
          <MuiCheckbox
            sx={{
              fontSize: "12px",
              paddingBlock: 0,
              paddingLeft: "8px",
              paddingRight: white ? "4px" : "8px",
              marginInline: "0px !important",
            }}
            icon={
              <Unchecked
                className={cn(
                  "h-auto w-5 translate-x-[-2px]",
                  disabled ? "fill-gray-500" : ""
                )}
              />
            }
            checkedIcon={
              <Checked
                className={cn(
                  "h-auto w-5 translate-x-[-2px]",
                  disabled ? "fill-gray-500" : "fill-mint"
                )}
              />
            }
            {...props}
            className="checkbox flex-shrink-0 hover:outline-none focus:outline-none"
          />
        }
        label={
          label && (
            <p
              className={cn(
                dark && "!text-black",

                "text-[12px] text-grey",

                labelClass,

                helperText && "!text-alert"
              )}
            >
              {label}
            </p>
          )
        }
      />
      {helperText && (
        <p className="absolute left-6 top-7 truncate text-[12px] font-medium text-alert">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
