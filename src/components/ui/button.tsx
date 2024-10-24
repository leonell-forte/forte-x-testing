import React from "react";
import { Button as ButtonComponent, ButtonProps } from "@mui/material";

interface IButtonProp extends ButtonProps {
  buttonType?: "primary" | "secondary" | "tertiary";
  active?: boolean;
}

const Button = ({
  buttonType,
  children,
  active,
  disabled,
  ...props
}: IButtonProp) => {
  const variants: Record<string, object> = {
    primary: {
      backgroundColor: active ? "#42ECA8" : "#fff",
      borderRadius: "100px",
      boxShadow: "none",
      color: disabled ? "#787878" : "#0A312A",
      fontWeight: "600",
    },

    secondary: {
      backgroundColor: "transparent",
      border: "2px solid",
      borderColor: active ? "#42ECA8" : "#ffffff",
      borderRadius: "100px",
      height: "44px",
      boxShadow: "none",
      color: disabled ? "#787878" : active ? "#42ECA8" : "#ffffff",
      fontWeight: "600",
    },

    tertiary: {
      backgroundColor: "transparent",
      borderRadius: "100px",
      height: "44px",
      boxShadow: "none",
      color: disabled ? "#787878" : active ? "#42ECA8" : "#ffffff",
      fontWeight: "600",
    },
  };

  return (
    <ButtonComponent
      sx={variants[(buttonType as keyof typeof variants) || "primary"]}
      {...props}
      className={"gap-[10px] !px-6 !normal-case h-11"}
    >
      {children}
    </ButtonComponent>
  );
};

export default Button;
