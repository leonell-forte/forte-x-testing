import { get, isEqual } from "lodash";
import {
  Control,
  Controller,
  ControllerProps,
  useFormContext,
} from "react-hook-form";

import Tooltip from "../tooltip/Tooltip";

type CustomProps = {
  name: string;
  control: Control<any>;
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

export default function CustomerController({
  name,
  control,
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
    >
      <div className="w-full">
        <Controller control={control} {...props} name={name} />
      </div>
    </Tooltip>
  );
}
