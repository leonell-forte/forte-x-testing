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
          borderColor: "#fff",
        },
        "&:hover fieldset": {
          borderColor: "#fff",
        },
        "&.Mui-focused fieldset": {
          border: "1.5px solid",
          borderColor: "#fff",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#fff",
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
        color: "#787878",
      },
    },
  };

  // Determine the appropriate variant
  const appliedVariant = disabled
    ? variants["disabled"]
    : error
    ? variants["error"]
    : variants[color || "default"];

  return <TextField sx={{ ...appliedVariant }} {...props} />;
};

export default Input;
