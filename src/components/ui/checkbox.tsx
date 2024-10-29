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

interface ICheckboxProps extends CheckboxProps {
  label?: string | ReactNode;
}

const Checkbox = ({ label, ...props }: ICheckboxProps) => {
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
    <FormControlLabel
      control={
        <MuiCheckbox
          sx={{
            fontSize: "12px",
            color: "red !important",
            "&.Mui-checked": {
              color: "red !important",
            },
          }}
          icon={<img src={renderIcons().unchecked} alt="unchecked" />}
          checkedIcon={<img src={renderIcons().checked} alt="checked" />}
          {...props}
        />
      }
      label={<span className="text-[12px] text-grey">{label}</span>}
    />
  );
};

export default Checkbox;
