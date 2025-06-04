"use client";

import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import classNames from "classnames";
import { ChangeEvent, forwardRef, useState } from "react";

import eyeClosed from "assets/images/icons/eye-closed.svg";
import eyeOpen from "assets/images/icons/eye-open.svg";

import { PHONE_NUMBER } from "lib/regex";
import { cn, getCurrencySymbol } from "lib/utils";

type PropTypes = TextFieldProps & {
  dark?: boolean;
  min?: number;
  wholeNumberOnly?: boolean;
  accept?: string;
  phoneNUmber?: boolean;
  readOnly?: boolean;
  isCurrency?: boolean;
  currency?: string;
  textarea?: boolean;
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
      currency = "USD",
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

    if (props.textarea) {
      // Only extract textarea-specific props if textarea is true
      const {
        className,
        value,
        onChange,
        minLength,
        maxLength,
        rows,
        placeholder,
        disabled,
        autoFocus,
        required,
        id,
        name: inputName,
        readOnly: inputReadOnly,
        style,
        tabIndex,
        title,
        defaultValue,
      } = props as Omit<typeof props, "textarea"> & {
        minLength?: number;
        maxLength?: number;
        rows?: number | string;
        autoFocus?: boolean;
        required?: boolean;
        id?: string;
        name?: string;
        readOnly?: boolean;
        style?: React.CSSProperties;
        tabIndex?: number;
        title?: string;
        defaultValue?: string;
      };
      const textareaRows = typeof rows === "number" ? rows : Number(rows) || 4;
      return (
        <div className={classNames("relative w-full")}>
          <textarea
            id={id || name}
            name={inputName || name}
            ref={ref as any}
            className={classNames(
              className,
              "block w-full rounded-lg border border-gray-300 bg-transparent p-2 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:border-white/10"
            )}
            value={value as string | undefined}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            readOnly={inputReadOnly ?? readOnly}
            disabled={disabled}
            minLength={minLength}
            maxLength={maxLength}
            rows={textareaRows}
            placeholder={placeholder}
            autoFocus={autoFocus}
            required={required}
            style={style}
            tabIndex={tabIndex}
            title={title}
            defaultValue={defaultValue}
          />
        </div>
      );
    }
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
                    <span
                      className={cn(
                        props.disabled ? "text-[#787878]" : "",
                        "text-lg"
                      )}
                    >
                      {getCurrencySymbol(currency)}
                    </span>
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
            aria-hidden="true"
            tabIndex={-1}
          >
            <img alt="eye" src={show ? eyeOpen : eyeClosed} />
          </button>
        )}
      </div>
    );
  }
);

export default Input;
