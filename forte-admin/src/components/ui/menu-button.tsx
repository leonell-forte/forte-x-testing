import {
  PopoverContentProps,
  PopoverProps,
  PopoverTriggerProps,
} from "@radix-ui/react-popover";
import { HTMLAttributes, PropsWithChildren } from "react";

import Button, { IButtonProp } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover/Popover";

const MenuButton = {
  Container: ({ children, ...props }: PropsWithChildren<PopoverProps>) => {
    return <Popover {...props}>{children}</Popover>;
  },

  Trigger: (props: PropsWithChildren<PopoverTriggerProps & IButtonProp>) => {
    return (
      <PopoverTrigger asChild {...props} className="w-fit">
        <Button {...props}>{props.children}</Button>
      </PopoverTrigger>
    );
  },

  Menu: (props: HTMLAttributes<HTMLUListElement> & PopoverContentProps) => {
    return (
      <PopoverContent
        className="w-fit"
        onOpenAutoFocus={(e) => e.preventDefault()}
        {...props}
      >
        <ul {...props}>{props.children}</ul>
      </PopoverContent>
    );
  },

  Item: (
    props: HTMLAttributes<Omit<HTMLLIElement, "onClick">> &
      HTMLAttributes<HTMLButtonElement> & { disabled?: boolean }
  ) => {
    return (
      <li {...props}>
        <button
          disabled={props.disabled}
          onClick={props.onClick}
          className="cursor-pointer px-3 py-2 text-black hover:text-mint disabled:cursor-not-allowed disabled:text-disabled"
        >
          {props.children}
        </button>
      </li>
    );
  },
};

export default MenuButton;
