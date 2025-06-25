import { type ComponentProps, createContext } from "react";
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  type UseFormReturn,
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

const Form = <T extends FieldValues>({
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

export default Form;
