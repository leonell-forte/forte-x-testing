"use client";

import { TextField, TextFieldProps } from "@mui/material";
import classNames from "classnames";
import { forwardRef, useState } from "react";

import eyeClosed from "assets/images/icons/eye-closed.svg";
import eyeOpen from "assets/images/icons/eye-open.svg";

type PropTypes = TextFieldProps & {
  dark?: boolean;

  noHelperText?: boolean;

  small?: boolean;

  min?: number;

  wholeNumberOnly?: boolean;

  accept?: string;
};

const Input = forwardRef<HTMLDivElement, PropTypes>(
  ({ dark, small, noHelperText, wholeNumberOnly, ...props }, ref) => {
    const [show, setShow] = useState(false);

    const { type } = props;

    return (
      <div className={classNames("relative w-full", !noHelperText && "pb-5")}>
        <TextField
          ref={ref}
          {...props}
          onWheel={(e) => (e.target as any).blur()}
          onKeyDown={(e) => {
            // prevents negative number if min is 0
            if (props.min! >= 0 && type === "number" && e.key === "-") {
              e.preventDefault();
            }

            if (
              wholeNumberOnly &&
              type === "number" &&
              (e.key === "." || e.key === ",")
            ) {
              e.preventDefault();
            }
          }}
          type={type === "password" ? (show ? "text" : "password") : type}
          sx={{
            "& .MuiInputBase-input": {
              ...(type === "password" && {
                paddingRight: "50px",
              }),

              ...(type === "search" && {
                paddingLeft: "48px !important", // adjust padding for input text if needed
                paddingRight: "45px",
              }),

              ...(small && {
                height: "10px",
              }),

              ...(type === "file" && {
                opacity: 0,
                cursor: "pointer",
              }),
            },

            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",

              ...(dark && {
                color: "black",

                "& fieldset": {
                  borderColor: "black",
                },

                "&:hover fieldset": {
                  borderColor: "black",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },

                "& .MuiInputLabel-root": {
                  color: "black",
                },

                "& .MuiFormHelperText-root": {
                  color: "black",
                },
              }),
            },
          }}
          slotProps={{
            htmlInput: {
              ...(type === "number" && { min: props.min }), // Set minimum value for type="number"
              accept: props.accept,
            },
          }}
          fullWidth
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-4 top-4"
          >
            <img alt="eye" src={show ? eyeOpen : eyeClosed} />
          </button>
        )}
      </div>
    );
  }
);

export default Input;
