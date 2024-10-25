import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup as RadioButtons,
} from "@mui/material";
import Image from "next/image";
import React, { useCallback } from "react";

interface IRadioGroupProps {
  items: string[];
  className?: string;
}

const RadioGroup = ({ items, className }: IRadioGroupProps) => {
  const renderIcons = useCallback(() => {
    let checked, unchecked;

    checked = "/images/icons/radio-checked.svg";
    unchecked = "/images/icons/radio-unchecked.svg";

    return { checked, unchecked };
  }, []);
  return (
    <FormControl>
      <RadioButtons
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
      >
        <div className={className}>
          {items?.map((item, index) => {
            return (
              <FormControlLabel
                value={item}
                control={
                  <Radio
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
                  />
                }
                label={item}
                key={index}
              />
            );
          })}
        </div>
      </RadioButtons>
    </FormControl>
  );
};

export default RadioGroup;
