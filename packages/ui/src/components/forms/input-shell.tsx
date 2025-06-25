import { cn } from "@repo/ui/lib/utils";
import { motion } from "framer-motion";

import { Label } from "../label";

interface InputShellProps {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
  children: React.ReactNode;
  error?: string;
}

const InputShell = ({
  name,
  label,
  helperText,
  required,
  containerClassName,
  children,
  error,
}: InputShellProps) => {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div>
        {children}
        <div className="mt-1 h-3.5">
          {error && (
            <motion.p
              className="text-destructive text-xs"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}{" "}
          {helperText && !error && (
            <p className="text-muted-foreground text-xs">{helperText}</p>
          )}
        </div>
      </div>
    </div>
  );
};

InputShell.displayName = "InputShell";

export default InputShell;
