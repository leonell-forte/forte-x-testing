import * as SelectPrimitive from "@radix-ui/react-select";
import classNames from "classnames";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";
import { FieldValues, Path } from "react-hook-form";

export const Select = SelectPrimitive.Root;

export const SelectValue = SelectPrimitive.Value;

interface ITrigger
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  error?: string;
}

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  ITrigger
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={classNames(
      "ring-offset-background flex h-[3.125rem] w-full items-center justify-between rounded-lg border p-[1rem] text-sm leading-4 sm:text-base",
      "focus:outline-none disabled:border-disabled",
      "disabled:cursor-not-allowed [&>span]:line-clamp-1",
      "[&[data-state=open]>svg]:rotate-180",
      "[&>span]:text-left [&>span]:text-inherit",
      "focus:border-selected data-[placeholder]:text-white/70",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 transform stroke-white/70 transition-all duration-300" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={classNames(
      "flex cursor-default items-center justify-center stroke-black py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4 stroke-black" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={classNames(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4 stroke-black" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={classNames(
        "text-popover-foreground relative z-50 max-h-96 max-w-min overflow-hidden rounded-md border bg-white shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 sm:min-w-[8rem] sm:max-w-max",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={classNames(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={classNames("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={classNames(
      "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-pointer select-none items-center text-sm sm:text-base",
      "rounded-sm p-4 outline-none data-[disabled]:pointer-events-none [&[data-state=checked]]:pointer-events-none",
      "data-[disabled]:opacity-50 [&>span]:w-full [&>span]:text-black hover:[&>span]:text-black/60 [&[data-state=checked]>span]:text-[#2ca373]",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={classNames("bg-muted -mx-1 my-1 h-px", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

type Props<T extends FieldValues> = {
  name: Path<T>;
  disabled?: boolean;
  placeholder?: string;
  options: any[];
  label: string;
} & React.ComponentPropsWithoutRef<typeof Select>;

export default function SelectComp<T extends FieldValues>({
  name,
  disabled = false,
  placeholder = undefined,
  options,
  label,
  ...props
}: Props<T>) {
  return (
    <div className="relative w-full">
      <Select name={name} disabled={disabled} {...props}>
        <SelectTrigger id={name}>
          <SelectValue id={name} placeholder={placeholder || label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((item, idx) => (
            <SelectItem key={idx} value={String(item.value || item.content)}>
              {item.content}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
