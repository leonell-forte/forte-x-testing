import * as amplitude from "@amplitude/analytics-browser";
import { Button as ButtonComponent, ButtonProps } from "@mui/material";
import classNames from "classnames";

interface IButtonProp extends ButtonProps {
  buttonType?: "primary" | "secondary" | "tertiary" | "default";
  active?: boolean;
  eventName?: string;
  loading?: boolean;
}

const Button = ({
  buttonType,
  children,
  active,
  disabled,
  eventName,
  onClick,
  type,
  loading,
  ...props
}: IButtonProp) => {
  const variants: Record<string, object> = {
    primary: {
      backgroundColor: active ? "#42ECA8" : "#fff",
      borderRadius: "100px",
      boxShadow: "none",
      color: disabled ? "#787878" : "#0A312A",
      fontWeight: "450",
      "&:hover": {
        backgroundColor: "#42ECA8",
      },
      transitionDuration: "500ms",
    },

    secondary: {
      backgroundColor: "transparent",
      border: "2px solid",
      borderColor: active ? "#42ECA8" : "#ffffff",
      borderRadius: "100px",
      height: "44px",
      boxShadow: "none",
      color: disabled ? "#787878" : active ? "#42ECA8" : "#ffffff",
      fontWeight: "450",
    },

    tertiary: {
      backgroundColor: "transparent",
      borderRadius: "100px",
      height: "44px",
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
      type={type || "button"}
      sx={variants[(buttonType as keyof typeof variants) || "primary"]}
      {...props}
      className={classNames(
        "h-11 gap-[10px] !px-6 !normal-case",

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
};

export default Button;
