import { ComponentProps, createContext, useState } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

interface FormProps<T extends FieldValues = any>
  extends Omit<ComponentProps<"form">, "onSubmit"> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  className?: string;
  order?: string[];
}

type IFormContext = {
  errorOrder?: string[];
};

const FormContext = createContext<IFormContext | undefined>(undefined);

export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  className,
  children,
  order,
  ...props
}: FormProps<T>) => {
  return (
    <FormContext.Provider value={{ errorOrder: order }}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
          <fieldset className={className}>{children}</fieldset>
        </form>
      </FormProvider>
    </FormContext.Provider>
  );
};
