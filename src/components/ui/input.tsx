"use client";

import { TextField, TextFieldProps } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

const Input = ({ ...props }: TextFieldProps) => {
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
          <Image
            width={21}
            height={21}
            alt="eye"
            src={
              show
                ? "/images/icons/eye-open.svg"
                : "/images/icons/eye-closed.svg"
            }
          />
        </button>
      )}
    </div>
  );
};

export default Input;
