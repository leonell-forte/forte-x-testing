import { InputAdornment } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import {
  type MobileDatePickerProps as DatePickerProps,
  MobileDatePicker as Picker,
} from "@mui/x-date-pickers/MobileDatePicker";
import { enUS } from "@mui/x-date-pickers/locales";
import classNames from "classnames";
import { type ReactNode } from "react";
import { HiCalendar } from "react-icons/hi";

import { DEFAULT_DATE_FORMAT } from "@/lib/constants";

interface IProps extends DatePickerProps<Date> {
  helperText?: string | ReactNode;

  error?: boolean;
}

const usLocale =
  enUS.components.MuiLocalizationProvider.defaultProps.localeText;

const DatePicker = ({
  helperText,

  error,

  value,

  ...props
}: IProps) => {
  const isDateSelected = value?.toString() !== "Invalid Date"; // Check if a date is selected

  return (
    <div
      className={classNames("relative w-full")}
      onClick={(e) => e.stopPropagation()}
    >
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        localeText={{
          ...usLocale,
          fieldMonthPlaceholder: (params) =>
            params.contentType === "letter" ? "MMM" : "MM",
        }}
      >
        <Picker
          {...props}
          value={value}
          format={DEFAULT_DATE_FORMAT}
          className="w-full"
          slotProps={{
            textField: {
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <HiCalendar />
                  </InputAdornment>
                ),
              },
              sx: {
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  borderRadius: "0.5rem",
                  cursor: props.readOnly
                    ? "default"
                    : props.disabled
                      ? "not-allowed"
                      : "pointer",

                  "& fieldset": {
                    borderColor: error
                      ? "#651A1A !important"
                      : "#ffffff4d !important",
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

                  // "& input::placeholder": {
                  //   color: error ? "#651A1A !important" : "white !important",

                  //   opacity: error ? 1 : 0.5,
                  // },

                  "& input": {
                    color: error ? "#651A1A !important" : "white",

                    opacity: isDateSelected ? 1 : 0.5,

                    fontWeight: 500,
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

            mobilePaper: {
              sx: {
                "& .MuiDialogContent-root": {
                  background:
                    "linear-gradient(36.06deg, #03677E 16.85%, #208C72 100.23%)",
                },

                "& .MuiTypography-root": {
                  color: "#fff", // Text color inside the calendar
                },

                "& .MuiPickersDay-today": {
                  color: "#42ECA8 !important", // Text color inside the calendar

                  border: "1px solid #42ECA8 !important",
                },

                "& .MuiPickersYear-yearButton": {
                  "&.Mui-selected": {
                    backgroundColor: "#0A312A !important", // Background color for selected day

                    color: "#fff", // Text color for selected day
                  },
                },

                "& .MuiButton-colorPrimary": {
                  color: "#fff !important",
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
