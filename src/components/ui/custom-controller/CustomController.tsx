import { get, isEqual } from "lodash";
import { ComponentPropsWithoutRef } from "react";
import {
  Control,
  Controller,
  ControllerProps,
  useFormContext,
} from "react-hook-form";

import { cn } from "lib/utils";

import Tooltip from "../tooltip/Tooltip";

type CustomProps = {
  name: string;
  control: Control<any>;
  label?: string;
  labelClassName?: string;
  required?: boolean;
  tooltip?: Pick<
    ComponentPropsWithoutRef<typeof Tooltip>,
    "position" | "offset"
  >;
  containerClassName?: string;
} & Omit<ControllerProps, "control">;

type ObjectWithMessage = { message: string; [key: string]: any };

function getFirstMessageProperty(
  obj: Record<string, any>
): ObjectWithMessage | null {
  const findMessage = (o: Record<string, any>): ObjectWithMessage | null => {
    if (typeof o !== "object" || o === null) return null;

    if ("message" in o) return o as ObjectWithMessage;

    for (const key in o) {
      const result = findMessage(o[key]);
      if (result) return result;
    }

    return null;
  };

  return findMessage(obj);
}

export default function CustomController({
  name,
  control,
  label,
  labelClassName,
  required = false,
  tooltip,
  containerClassName,
  ...props
}: CustomProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const err = get(errors, name);
  const result = getFirstMessageProperty(errors);

  const isFirstIndex = isEqual(err, result);

  return (
    <Tooltip
      content={result?.message}
      open={Boolean(result?.message) && isFirstIndex}
      {...(tooltip && tooltip)}
    >
      <div className={cn("flex w-full items-center", containerClassName)}>
        {label && (
          <label htmlFor={name} className={cn("min-w-[140px]", labelClassName)}>
            {label}
            <span className="text-lg font-bold">{required ? "*" : ""}</span>
          </label>
        )}
        <Controller control={control} {...props} name={name} />
      </div>
    </Tooltip>
  );
}
