import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import {
  DatePickerProps,
  DatePicker as Picker,
} from "@mui/x-date-pickers/DatePicker";
import classNames from "classnames";
import { ReactNode } from "react";

interface IProps extends DatePickerProps<Date> {
  helperText?: string | ReactNode;

  error?: boolean;

  noHelperText?: boolean;
}

const DatePicker = ({ helperText, error, noHelperText, ...props }: IProps) => {
  return (
    <div className={classNames("relative w-full", !noHelperText && "pb-5")}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Picker
          {...props}
          slotProps={{
            textField: {
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",

                  "& fieldset": {
                    borderColor: error ? "#DE4841" : "#ffffff !important",
                  },

                  "&:hover fieldset": {
                    borderColor: error ? "#DE4841" : "#ffffff !important",
                  },

                  "&.Mui-focused fieldset": {
                    border: "1.5px solid",

                    borderColor: error ? "#DE4841" : "#ffffff !important",

                    color: error ? "#DE4841" : "#ffffff !important",
                  },

                  "& input::placeholder": {
                    color: error ? "#DE4841" : "white !important",

                    opacity: error ? 1 : 0.5,
                  },

                  "& input": {
                    color: error ? "red" : "white",
                  },
                },

                "& .MuiInputLabel-root": {
                  color: error ? "#DE4841" : "#ffffff !important",

                  "&.Mui-focused": {
                    color: error ? "#DE4841" : "white !important",
                  },
                },

                "& .MuiSvgIcon-root": {
                  fill: error ? "#DE4841" : "#ffffff !important",
                },
              },
            },

            popper: {
              sx: {
                "& .MuiPaper-root": {
                  backgroundColor: "#222", // Calendar background color

                  color: "#fff", // Text color inside the calendar
                },

                "& .MuiTypography-root": {
                  color: "#fff", // Text color inside the calendar
                },

                "& .MuiPickersDay-today": {
                  backgroundColor: "#222! important", // Calendar background color

                  color: "#fff !important", // Text color inside the calendar

                  border: "1px solid white !important",
                },

                "& .MuiPickersYear-yearButton": {
                  "&.Mui-selected": {
                    backgroundColor: "#0A312A !important", // Background color for selected day

                    color: "#fff", // Text color for selected day
                  },
                },
              },
            },

            day: {
              sx: {
                color: "#fff", // Day text color

                "&.Mui-selected": {
                  backgroundColor: "#0A312A !important", // Background color for selected day

                  color: "#fff", // Text color for selected day
                },

                "&:hover": {
                  backgroundColor: "#D9EAF3 !important", // Hover effect for day

                  color: "black !important",
                },
              },
            },
          }}
        />

        {helperText && (
          <div className="pl-4 pt-1 absolute">
            <p
              className={classNames(
                "text-white text-[12px] line-clamp-1",

                error && "!text-[#e61a1a]",
              )}
            >
              {helperText}
            </p>
          </div>
        )}
      </LocalizationProvider>
    </div>
  );
};

export default DatePicker;
