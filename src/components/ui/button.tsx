import { Button as ButtonComponent, ButtonProps } from "@mui/material";
import * as amplitude from "@amplitude/analytics-browser";

interface IButtonProp extends ButtonProps {
  buttonType?: "primary" | "secondary" | "tertiary" | "default";
  active?: boolean;
  eventName?: string;
}

const Button = ({
  buttonType,
  children,
  active,
  disabled,
  eventName,
  onClick,
  type,
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
    default: {
      backgroundColor: "transparent",
      borderRadius: "0px",
      height: "auto",
      boxShadow: "none",
      color: "black",
      fontWeight: "600",
    },
  };
  const { id } = props;

  return (
    <ButtonComponent
      type={type || "button"}
      sx={variants[(buttonType as keyof typeof variants) || "primary"]}
      {...props}
      className={"gap-[10px] !px-6 !normal-case h-11"}
      disabled={disabled}
      onClick={(e) => {
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
      {children}
    </ButtonComponent>
  );
};

export default Button;
