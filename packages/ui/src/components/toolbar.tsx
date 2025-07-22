"use client";

import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { buttonVariants } from "@repo/ui/components/button";
import { toggleVariants } from "@repo/ui/components/toggle";
import { cn } from "@repo/ui/lib/utils";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

const ToolbarToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "sm",
  variant: "default",
});

function Toolbar({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Root>) {
  return (
    <ToolbarPrimitive.Root
      className={cn(
        "bg-toolbar flex items-center space-x-1 rounded-md border p-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </ToolbarPrimitive.Root>
  );
}

Toolbar.displayName = ToolbarPrimitive.Root.displayName;

function ToolbarButton({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Button>) {
  return (
    <ToolbarPrimitive.Button
      className={cn(
        "hover:text-primary ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 aria-invalid:focus-visible:ring-0 disabled:text-muted-foreground flex flex-col items-center justify-center gap-y-1.5 whitespace-nowrap rounded-md text-sm font-medium transition focus-visible:outline-1 focus-visible:ring-4 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
}

ToolbarButton.displayName = ToolbarPrimitive.Button.displayName;

function ToolbarToggleGroup({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleGroup> &
  React.ComponentProps<typeof ToolbarToggleGroupContext.Provider>["value"]) {
  return (
    <ToolbarPrimitive.ToggleGroup
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      <ToolbarToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToolbarToggleGroupContext.Provider>
    </ToolbarPrimitive.ToggleGroup>
  );
}

ToolbarToggleGroup.displayName = ToolbarPrimitive.ToggleGroup.displayName;

function ToolbarToggleItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleItem>) {
  const context = React.useContext(ToolbarToggleGroupContext);

  return (
    <ToolbarPrimitive.ToggleItem
      className={cn(
        toggleVariants({
          variant: context.variant,
          size: context.size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToolbarPrimitive.ToggleItem>
  );
}

ToolbarToggleItem.displayName = ToolbarPrimitive.ToggleItem.displayName;

function ToolbarSeparator({
  className,
  orientation = "vertical",
  decorative = true,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
  return (
    <ToolbarPrimitive.Separator
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-[1px] w-7" : "h-7 w-[1px]",
        className
      )}
      {...props}
    />
  );
}

ToolbarSeparator.displayName = ToolbarPrimitive.Separator.displayName;

function ToolbarLink({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToolbarLink>) {
  return (
    <ToolbarPrimitive.Link
      className={cn(buttonVariants({ variant: "link" }), className)}
      {...props}
    />
  );
}

ToolbarLink.displayName = ToolbarPrimitive.Link.displayName;

export {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
};
