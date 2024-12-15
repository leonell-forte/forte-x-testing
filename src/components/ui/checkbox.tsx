import {
  CheckboxProps,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import classNames from "classnames";
import { ReactNode, useCallback } from "react";

import check from "assets/images/icons/checkbox-checked.svg";
import checkedDisabled from "assets/images/icons/checkbox-disabled-checked.svg";
import unCheckedDisabled from "assets/images/icons/checkbox-disabled-unchecked.svg";
import unChecked from "assets/images/icons/checkbox-unchecked.svg";

interface ICheckboxProps extends CheckboxProps {
  label?: string | ReactNode;
  helperText?: string | ReactNode;
  dark?: boolean;
  labelClass?: string;
}

const Checkbox = ({
  label,
  helperText,
  dark,
  labelClass,
  ...props
}: ICheckboxProps) => {
  const { disabled } = props;

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
    <div className="relative">
      <FormControlLabel
        control={
          <MuiCheckbox
            sx={{
              fontSize: "12px",
            }}
            icon={<img src={renderIcons().unchecked} alt="unchecked" />}
            checkedIcon={<img src={renderIcons().checked} alt="checked" />}
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
