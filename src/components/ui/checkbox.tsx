import React from "react";
import {
  CheckboxProps,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from "@mui/material";

interface ICheckboxProps extends CheckboxProps {
  label?: string;
}

const Checkbox = ({ label, ...props }: ICheckboxProps) => {
  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          sx={{
            fontSize: "12px",
          }}
          {...props}
        />
      }
      label={<span className="text-[12px] text-grey">{label}</span>}
    />
  );
};

export default Checkbox;
