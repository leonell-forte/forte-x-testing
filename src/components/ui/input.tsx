"use client";

import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef, useState } from "react";
import eyeOpen from "../../assets/images/icons/eye-open.svg";
import eyeClosed from "../../assets/images/icons/eye-closed.svg";

const Input = forwardRef<HTMLDivElement, TextFieldProps>(({ ...props }) => {
  const [show, setShow] = useState(false);
  const { type } = props;

  return (
    <div className="relative w-full">
      <TextField
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
        }}
        fullWidth
      />

      {type === "password" && (
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-4 top-5"
        >
          <img alt="eye" src={show ? eyeOpen : eyeClosed} />
        </button>
      )}
    </div>
  );
});

export default Input;
