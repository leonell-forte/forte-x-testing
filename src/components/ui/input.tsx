"use client";

import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef, useState } from "react";
import eyeOpen from "../../assets/images/icons/eye-open.svg";
import eyeClosed from "../../assets/images/icons/eye-closed.svg";
import classNames from "classnames";

type PropTypes = TextFieldProps & {
  dark?: boolean;
  noHelperText?: boolean;
};

const Input = forwardRef<HTMLDivElement, PropTypes>(
  ({ dark, noHelperText, ...props }, ref) => {
    const [show, setShow] = useState(false);

    const { type } = props;

    return (
      <div className={classNames("relative w-full", !noHelperText && "pb-5")}>
        <TextField
          ref={ref}
          {...props}
          type={type === "password" ? (show ? "text" : "password") : type}
          sx={{
            "& .MuiInputBase-input": {
              ...(type === "password" && {
                paddingRight: "50px",
              }),

              ...(type === "search" && {
                paddingLeft: "40px !important", // adjust padding for input text if needed
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
          fullWidth
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-4 top-5"
          >
            <img
              alt="eye"
              src={show ? eyeOpen : eyeClosed}
            />
          </button>
        )}
      </div>
    );
  },
);

export default Input;
