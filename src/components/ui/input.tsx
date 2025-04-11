"use client";

import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import classNames from "classnames";
import { ChangeEvent, forwardRef, useState } from "react";
import { FaDollarSign as USD } from "react-icons/fa6";

import eyeClosed from "assets/images/icons/eye-closed.svg";
import eyeOpen from "assets/images/icons/eye-open.svg";

import { PHONE_NUMBER } from "lib/regex";
import { cn } from "lib/utils";

type PropTypes = TextFieldProps & {
  dark?: boolean;

  min?: number;

  wholeNumberOnly?: boolean;

  accept?: string;

  phoneNUmber?: boolean;

  readOnly?: boolean;

  isCurrency?: boolean;
};

const Input = forwardRef<HTMLDivElement, PropTypes>(
  (
    {
      dark,
      wholeNumberOnly,
      phoneNUmber,
      name,
      readOnly = false,
      isCurrency = false,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = useState(false);

    const { type } = props;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (phoneNUmber && !PHONE_NUMBER.test(e.target.value)) {
        return;
      }

      props.onChange?.(e);
    };

    return (
      <div className={classNames("relative w-full")}>
        <TextField
          id={name}
          name={name}
          ref={ref}
          slotProps={{
            htmlInput: {
              ...(type === "number" && { min: props.min }), // Set minimum value for type="number"
              accept: props.accept,
              readOnly,
            },
            ...(isCurrency && {
              input: {
                startAdornment: (
                  <InputAdornment position="start" className="ml-3">
                    <USD
                      className={cn(props.disabled ? "fill-[#787878]" : "", "")}
                    />
                  </InputAdornment>
                ),
              },
            }),
          }}
          {...props}
          onChange={handleChange}
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
            "& .MuiInputLabel-root": {
              top: "-15%",
            },
            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
              {
                top: "5%",
              },
            "& .Mui-disabled": {
              cursor: "not-allowed",
            },

            "& .MuiFormLabel-root": {
              lineHeight: "120%",
            },

            "& .MuiInputBase-input": {
              ...(type === "password" && {
                paddingRight: "50px",
              }),

              ...(type === "search" && {
                height: "21px",
                paddingLeft: "40px !important", // adjust padding for input text if needed
                paddingRight: "40px",
              }),

              ...(type === "file" && {
                opacity: 0,
                cursor: "pointer",
              }),
            },

            "& .MuiOutlinedInput-root": {
              borderRadius: "0.5rem",
              padding: 0,

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
            className="absolute right-4 top-3.5 w-4"
          >
            <img alt="eye" src={show ? eyeOpen : eyeClosed} />
          </button>
        )}
      </div>
    );
  }
);

export default Input;
