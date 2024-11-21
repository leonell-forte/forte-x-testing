"use client";

import { createTheme, ThemeProvider } from "@mui/material";
import React, { ReactNode } from "react";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          // Primary Variant (default)
          ...(ownerState.color === "primary" && {
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
              color: "#ffffff !important",
            },
            "& .MuiFormHelperText-root": {
              position: "absolute",
              bottom: -25,
              color: "#ffffff",
            },
          }),
          // Success Variant
          ...(ownerState.color === "success" && {
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
            "& .MuiFormHelperText-root": {
              position: "absolute",
              bottom: -25,
              color: "#42ECA8",
            },
            "& .MuiInputBase-input": {
              color: "#42ECA8",
            },
          }),
          // Error Variant
          ...(ownerState.error && {
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px !important",
              color: "#e61a1a !important",
              "& fieldset": {
                borderColor: "#e61a1a !important",
              },
              "&:hover fieldset": {
                borderColor: "#e61a1a !important",
                color: "#e61a1a !important",
              },
              "&.Mui-focused fieldset": {
                border: "1.5px solid",
                borderColor: "#e61a1a",
                color: "#e61a1a !important",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#e61a1a",
            },
            "& .MuiFormHelperText-root": {
              position: "absolute",
              bottom: -25,
              color: "#e61a1a !important",
            },
            "& .MuiInputBase-input": {
              color: "#fff !important",
            },
          }),
          // Disabled Variant
          ...(ownerState.disabled && {
            "& .MuiOutlinedInput-root.Mui-disabled": {
              "& .MuiInputBase-input": {
                "-webkit-text-fill-color": "#fff !important", // Override text fill color
              },
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "&.Mui-disabled fieldset": {
                borderColor: "#fff",
              },
            },
            "& .MuiFormHelperText-root": {
              position: "absolute",
              bottom: -25,
              color: "#787878 !important",
            },
          }),
          ...(ownerState.multiline && {
            "& .MuiInputBase-inputMultiline": {
              minHeight: "119px", // Set desired min height here
            },
          }),
        }),
      },
    },
  },
});

const MuiProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MuiProvider;
