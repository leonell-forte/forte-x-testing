"use client";

import { useTheme } from "next-themes";
import { toast as sonnerToast } from "sonner";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { Button } from "./button";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };

function toast(toast: Omit<ToastProps, "id">) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      button={toast.button}
    />
  ));
}

function Toast(props: ToastProps) {
  const { title, description, button, id } = props;

  return (
    <div className="toast bg-popover flex w-full items-center gap-4 rounded-lg p-4 shadow-lg ring-1 ring-black/5 md:max-w-sm">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-popover-foreground text-sm font-medium">{title}</p>
          {description && (
            <p className="text-popover-foreground mt-1 text-sm">
              {description}
            </p>
          )}
        </div>
      </div>
      {button && (
        <Button
          size="sm"
          onClick={() => {
            button.onClick();
            sonnerToast.dismiss(id);
          }}
        >
          {button.label}
        </Button>
      )}
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  button?: {
    label: string;
    onClick: () => void;
  };
}

export { toast };
