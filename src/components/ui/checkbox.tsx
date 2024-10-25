import React, { ReactNode, useCallback } from "react";
import {
  CheckboxProps,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import Image from "next/image";

interface ICheckboxProps extends CheckboxProps {
  label?: string | ReactNode;
}

const Checkbox = ({ label, ...props }: ICheckboxProps) => {
  const { disabled } = props;

  const renderIcons = useCallback(() => {
    let checked, unchecked;

    if (disabled) {
      checked = "/images/icons/checkbox-disabled-checked.svg";
      unchecked = "/images/icons/checkbox-disabled-unchecked.svg";
    } else {
      checked = "/images/icons/checkbox-checked.svg";
      unchecked = "/images/icons/checkbox-disabled-unchecked.svg";
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
          icon={
            <Image
              width={20}
              height={20}
              src={renderIcons().unchecked}
              alt="unchecked"
            />
          }
          checkedIcon={
            <Image
              width={20}
              height={20}
              src={renderIcons().checked}
              alt="checked"
            />
          }
          {...props}
        />
      }
      label={<span className="text-[12px] text-grey">{label}</span>}
    />
  );
};

export default Checkbox;
