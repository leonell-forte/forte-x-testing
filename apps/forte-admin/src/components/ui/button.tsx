import * as amplitude from "@amplitude/analytics-browser";
import { Button as ButtonComponent, type ButtonProps } from "@mui/material";
import classNames from "classnames";
import { forwardRef } from "react";

export interface IButtonProp extends ButtonProps {
  buttonType?: "primary" | "secondary" | "tertiary" | "default";
  active?: boolean;
  eventName?: string;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, IButtonProp>(
  (
    {
      buttonType,
      children,
      active,
      disabled,
      eventName,
      onClick,
      type,
      loading,
      ...props
    },
    ref
  ) => {
    const variants: Record<string, object> = {
      primary: {
        backgroundColor: disabled ? "#C6C6C6" : "#42eca8",
        borderRadius: "100px",
        boxShadow: "none",
        color: disabled ? "#8E8E8E" : "#0A312A",
        fontWeight: "450",
        "&:hover": {
          backgroundColor: "#14c57e",
        },
        transitionProperty: "all",
        transitionDuration: "400ms",
      },
      secondary: {
        backgroundColor: "transparent",
        border: "2px solid",
        borderColor: disabled ? "#0A312Aa" : active ? "#42ECA8" : "#ffffff",
        borderRadius: "100px",
        boxShadow: "none",
        color: disabled ? "#787878" : active ? "#42ECA8" : "#ffffff",
        fontWeight: "450",
        stroke: "white",
        fill: "white",
        "&:hover": {
          borderColor: "#42ECA8",
          color: "#42ECA8",
          fill: "#42ECA8",
          stroke: "#42ECA8",
        },
        transitionProperty: "all",
        transitionDuration: "400ms",
      },
      tertiary: {
        backgroundColor: "transparent",
        borderRadius: "100px",
        boxShadow: "none",
        color: disabled ? "#787878" : active ? "#42ECA8" : "#ffffff",
        fontWeight: "450",
      },
      default: {
        backgroundColor: "transparent",
        borderRadius: "0px",
        height: "auto",
        boxShadow: "none",
        color: "black",
        fontWeight: "450",
      },
    };

    const { id } = props;

    return (
      <ButtonComponent
        ref={ref}
        type={type || "button"}
        sx={variants[(buttonType as keyof typeof variants) || "primary"]}
        {...props}
        className={classNames(
          "h-10 gap-[10px] truncate !px-6 py-2.5 !normal-case transition-all",
          props.className
        )}
        disabled={disabled || loading}
        onClick={(e) => {
          e.stopPropagation();
          if (eventName) {
            amplitude.track(`${eventName} Button Click`, {
              id,
            });
          }
          if (onClick) {
            onClick(e);
          }
        }}
      >
        {loading ? "Loading..." : children}
      </ButtonComponent>
    );
  }
);

Button.displayName = "Button"; // Important for React DevTools and forwardRef

export default Button;
