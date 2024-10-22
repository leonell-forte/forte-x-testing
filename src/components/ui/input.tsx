import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

const Input = ({ ...props }: TextFieldProps) => {
  const { error, disabled, color } = props;

  // Define style variants for different states
  const variants: Record<string, object> = {
    default: {
      "& .MuiOutlinedInput-root": {
        color: "white",
        "& fieldset": {
          borderColor: "#fff",
        },
        "&:hover fieldset": {
          borderColor: "#fff",
        },
        "&.Mui-focused fieldset": {
          border: "1px solid",
          borderColor: "#fff",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#fff",
      },
    },
    success: {
      "& .MuiOutlinedInput-root": {
        color: "white",
        "& fieldset": {
          borderColor: "#42ECA8",
        },
        "&:hover fieldset": {
          borderColor: "#42ECA8",
        },
        "&.Mui-focused fieldset": {
          border: "1px solid",
          borderColor: "#42ECA8",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#42ECA8",
      },
    },
    error: {
      "& .MuiOutlinedInput-root": {
        color: "white",
        "& fieldset": {
          borderColor: "#FF956B",
        },
        "&:hover fieldset": {
          borderColor: "#FF956B",
        },
        "&.Mui-focused fieldset": {
          border: "1px solid",
          borderColor: "#FF956B",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#FF956B",
      },
    },
    disabled: {
      "& .MuiOutlinedInput-root": {
        color: "#fff",
        "& fieldset": {
          borderColor: "#787878",
        },
      },
    },
  };

  // Determine the appropriate variant
  const appliedVariant = disabled
    ? variants["disabled"]
    : error
    ? variants["error"]
    : variants[color || "default"];

  return <TextField sx={appliedVariant} {...props} />;
};

export default Input;
