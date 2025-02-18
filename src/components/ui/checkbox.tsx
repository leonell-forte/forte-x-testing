import {
  CheckboxProps,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import classNames from "classnames";
import { ReactNode, useCallback } from "react";
import { MdCheckBox as Checked } from "react-icons/md";
import { MdCheckBoxOutlineBlank as Unchecked } from "react-icons/md";

import check from "assets/images/icons/checkbox-checked.svg";
import checkedDisabled from "assets/images/icons/checkbox-disabled-checked.svg";
import unCheckedDisabled from "assets/images/icons/checkbox-disabled-unchecked.svg";
import unChecked from "assets/images/icons/checkbox-unchecked.svg";

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
  const renderIcons = useCallback(() => {
    let checked, unchecked;

    if (disabled) {
      checked = checkedDisabled;
      unchecked = unCheckedDisabled;
    } else {
      checked = check;
      unchecked = unChecked;
    }

    return { checked, unchecked };
  }, [disabled]);
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
            {...(white
              ? {
                  icon: <Unchecked className="text-xl" />,
                  checkedIcon: <Checked className="text-xl" />,
                }
              : {
                  icon: (
                    <img
                      src={renderIcons().unchecked}
                      alt="unchecked"
                      className="w-4"
                    />
                  ),
                  checkedIcon: (
                    <img
                      src={renderIcons().checked}
                      alt="checked"
                      className="w-4"
                    />
                  ),
                })}
            {...props}
            className="flex-shrink-0"
          />
        }
        label={
          label && (
            <p
              className={classNames(
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
