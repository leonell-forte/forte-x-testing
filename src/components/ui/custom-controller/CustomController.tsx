import { useMemo } from "react";
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";

import Tooltip from "../tooltip/Tooltip";

type CustomProps<T> = {
  name: string;
  control: Control<any>;
} & Omit<ControllerProps, "control">;

export default function CustomerController<T extends FieldValues>({
  name,
  control,
  ...props
}: CustomProps<T>) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string;

  const isFirstIndex = useMemo(() => {
    const mapper = Object.keys(errors);
    return mapper.findIndex((x) => x === name) === 0;
  }, [errors, name]);

  return (
    <Tooltip content={error} open={Boolean(error) && isFirstIndex}>
      <div className="w-full">
        <Controller control={control} {...props} name={name} />
      </div>
    </Tooltip>
  );
}
