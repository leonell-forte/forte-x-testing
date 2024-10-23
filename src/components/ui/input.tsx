"use client";
import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

const Input = ({ ...props }: TextFieldProps) => {
  const { error, disabled, color } = props;

  // Define style variants for different states
  const variants: Record<string, object> = {
    primary: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        color: "white",
        "& fieldset": {
          borderColor: "#ffffff",
        },
        "&:hover fieldset": {
          borderColor: "#ffffff",
        },
        "&.Mui-focused fieldset": {
          border: "1.5px solid",
          borderColor: "#ffffff",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#ffffff",
      },
    },
    success: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        color: "white",
        "& fieldset": {
          borderColor: "#42ECA8",
        },
        "&:hover fieldset": {
          borderColor: "#42ECA8",
        },
        "&.Mui-focused fieldset": {
          border: "1.5px solid",
          borderColor: "#42ECA8",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#42ECA8",
      },
    },
    error: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "&.Mui-focused fieldset": {
          border: "1.5px solid",
          borderColor: "#E61A1A",
        },
      },
    },
    disabled: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        color: "#787878",
        "&.Mui-disabled fieldset": {
          border: "1.5px solid",
          borderColor: "#787878",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#787878 !important",
      },
    },
  };

  // Determine the appropriate variant
  const appliedVariant = disabled
    ? variants["disabled"]
    : error
    ? variants["error"]
    : variants["primary"];

  return (
    <TextField
      sx={{ ...appliedVariant, height: "50px !important" }}
      {...props}
    />
  );
};

export default Input;
