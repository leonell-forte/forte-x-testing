import { ReactNode, useCallback } from "react";
import {
  CheckboxProps,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import checkedDisabled from "../../assets/images/icons/checkbox-disabled-checked.svg";
import unCheckedDisabled from "../../assets/images/icons/checkbox-disabled-unchecked.svg";
import check from "../../assets/images/icons/checkbox-checked.svg";
import unChecked from "../../assets/images/icons/checkbox-unchecked.svg";
import classNames from "classnames";

interface ICheckboxProps extends CheckboxProps {
  label?: string | ReactNode;
  helperText?: string | ReactNode;
  dark?: boolean;
}

const Checkbox = ({ label, helperText, dark, ...props }: ICheckboxProps) => {
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
          <span
            className={classNames(
              dark && "!text-black",
              "text-[12px] text-grey"
            )}
          >
            {label}
          </span>
        }
      />
      {helperText && (
        <p className="absolute text-alert top-7 left-6 text-[10px] font-medium truncate">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
