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

const DatePicker = ({
  helperText,

  error,

  noHelperText,

  value,

  ...props
}: IProps) => {
  const isDateSelected = value?.toString() !== "Invalid Date"; // Check if a date is selected

  return (
    <div className={classNames("relative w-full", !noHelperText && "pb-5")}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Picker
          {...props}
          value={value}
          format="dd/LL/yyyy"
          slotProps={{
            textField: {
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",

                  "& fieldset": {
                    borderColor: error
                      ? "#651A1A !important"
                      : "#ffffff !important",
                  },

                  "&:hover fieldset": {
                    borderColor: error
                      ? "#651A1A !important"
                      : "#ffffff !important",
                  },

                  "&.Mui-focused fieldset": {
                    border: "1.5px solid",

                    borderColor: error
                      ? "#651A1A !important"
                      : "#ffffff !important",

                    color: error ? "#651A1A !important" : "#ffffff !important",
                  },

                  "& input::placeholder": {
                    color: error ? "#651A1A !important" : "white !important",

                    opacity: error ? 1 : 0.5,
                  },

                  "& input": {
                    color: error
                      ? "#651A1A !important"
                      : isDateSelected
                        ? "white"
                        : "#abb2b3 !important",

                    fontWeight: 300,
                  },
                },

                "& .MuiInputLabel-root": {
                  color: error ? "#651A1A !important" : "#ffffff !important",

                  "&.Mui-focused": {
                    color: error ? "#651A1A !important" : "white !important",
                  },
                },

                "& .MuiSvgIcon-root": {
                  fill: error ? "#651A1A !important" : "#ffffff !important",
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
          <div className="absolute pl-4">
            <p
              className={classNames(
                "text-[12px] font-medium text-white",
                error && "!text-alert"
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
