"use client";
import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

const Input = ({ ...props }: TextFieldProps) => {
  return <TextField {...props} />;
};

export default Input;
