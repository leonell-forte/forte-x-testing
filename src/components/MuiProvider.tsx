"use client";

import { ThemeProvider, createTheme } from "@mui/material";
import React, { ReactNode } from "react";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          // Primary Variant (default)
          "& input[type='search']::-webkit-search-cancel-button": {
            display: "none",
          },

          "& .MuiInputBase-input": {
            height: 17.03,
          },

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
              height: "50px",

              borderRadius: "10px !important",

              color: "#651A1A !important",

              "& fieldset": {
                borderColor: "#651A1A !important",
              },

              "&:hover fieldset": {
                borderColor: "#651A1A !important",

                color: "#651A1A !important",
              },

              "&.Mui-focused fieldset": {
                border: "1.5px solid",

                borderColor: "#651A1A",

                color: "#651A1A !important",
              },
            },

            "& .MuiInputLabel-root": {
              color: "#651A1A !important",
            },

            "& .MuiFormHelperText-root": {
              position: "absolute",

              bottom: -20,

              left: 0,

              color: "#651A1A !important",

              whiteSpace: "nowrap" /* Prevents wrapping */,

              overflow: "hidden" /* Hides any overflow */,

              textOverflow:
                "ellipsis" /* Adds ellipsis if the text is too long */,

              width: "100%" /* Make sure the width is set, adjust as needed */,
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
            "& .MuiInputBase-inputMultiline": {},
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
