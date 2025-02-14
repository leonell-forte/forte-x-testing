import {
  CheckboxProps,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import classNames from "classnames";
import { ReactNode } from "react";
import { MdCheckBox as Checked } from "react-icons/md";
import { MdCheckBoxOutlineBlank as Unchecked } from "react-icons/md";

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
  return (
    <div className="relative pl-[3px]">
      <FormControlLabel
        control={
          <MuiCheckbox
            sx={{
              fontSize: "12px",
              paddingBlock: 0,
              paddingLeft: "8px",
              paddingRight: "4px",
            }}
            icon={<Unchecked className="text-xl" />}
            checkedIcon={<Checked className="text-xl" />}
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
