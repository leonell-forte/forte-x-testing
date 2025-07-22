import { cn } from "@repo/ui/lib/utils";
import { NumericFormat, type NumericFormatProps } from "react-number-format";

interface InputNumberProps extends Omit<NumericFormatProps, "format"> {
  className?: string;
  format?: string;
  name?: string;
}

function InputNumber({ className, name, ...props }: InputNumberProps) {
  return (
    <NumericFormat
      id={name}
      name={name}
      thousandSeparator=","
      allowNegative={false}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground form-input",
        className
      )}
      {...props}
    />
  );
}

export { InputNumber };
