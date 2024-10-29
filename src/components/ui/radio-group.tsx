import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup as RadioButtons,
} from "@mui/material";
import { useCallback } from "react";

interface IRadioGroupProps {
  items: string[];
  className?: string;
}

const RadioGroup = ({ items, className }: IRadioGroupProps) => {
  const renderIcons = useCallback(() => {
    const checked = "/images/icons/radio-checked.svg";
    const unchecked = "/images/icons/radio-unchecked.svg";

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
                    icon={<img src={renderIcons().unchecked} alt="unchecked" />}
                    checkedIcon={
                      <img src={renderIcons().checked} alt="checked" />
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
