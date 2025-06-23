import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup as RadioButtons,
} from "@mui/material";
import { ChangeEvent, useCallback } from "react";

import radioChecked from "assets/images/icons/radio-checked.svg";
import radioUnchecked from "assets/images/icons/radio-unchecked.svg";

interface IRadioGroupProps {
  items: {
    label: string;
    value: string;
  }[];

  className?: string;

  value?: string;

  disabled?: boolean;

  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroup = ({
  items,

  className,

  disabled,

  onChange,

  value,
}: IRadioGroupProps) => {
  const renderIcons = useCallback(() => {
    const checked = radioChecked;

    const unchecked = radioUnchecked;

    return { checked, unchecked };
  }, []);
  return (
    <FormControl>
      <RadioButtons
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
      >
        <div className={className}>
          {items?.map((item, index) => {
            return (
              <FormControlLabel
                value={item.value}
                checked={value === item.value}
                control={
                  <Radio
                    disabled={disabled}
                    size="small"
                    icon={
                      <img
                        src={renderIcons().unchecked}
                        alt="unchecked"
                        className={disabled ? "grayscale" : ""}
                      />
                    }
                    checkedIcon={
                      <img
                        src={renderIcons().checked}
                        alt="checked"
                        className={disabled ? "grayscale" : ""}
                      />
                    }
                    onChange={onChange}
                  />
                }
                label={item.label}
                key={index}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    color: "white !important",
                    fontSize: 14,
                  },
                  "& .MuiRadio-root ": {
                    width: "2rem",
                  },
                }}
              />
            );
          })}
        </div>
      </RadioButtons>
    </FormControl>
  );
};

export default RadioGroup;
