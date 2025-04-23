import classNames from "classnames";
import React, {
  HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useReducer,
} from "react";

type StepperState = {
  activeStep: number;
};

type StepperAction = {
  type: "SET_STEP";
  payload: number;
};

type StepperContextType = {
  state: StepperState;
  dispatch: React.Dispatch<StepperAction>;
};

const initialState: StepperState = {
  activeStep: 1,
};

const StepperContext = createContext<StepperContextType | undefined>(undefined);

const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
};

const reducer = (
  state: StepperState,
  { type, payload }: StepperAction
): StepperState => {
  switch (type) {
    case "SET_STEP":
      return {
        ...state,
        activeStep: payload,
      };
    default:
      return state;
  }
};

const StepperProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StepperContext.Provider value={{ state, dispatch }}>
      {children}
    </StepperContext.Provider>
  );
};

type StepperProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  activeStep?: number;
};

const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ activeStep = 1, ...props }, ref) => {
    return (
      <StepperProvider>
        <InnerStepper ref={ref} activeStep={activeStep} {...props} />
      </StepperProvider>
    );
  }
);

// Now define InnerStepper separately:
const InnerStepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ activeStep = 1, ...props }, ref) => {
    const { dispatch } = useStepper();

    useEffect(() => {
      dispatch({ type: "SET_STEP", payload: activeStep });
    }, [activeStep, dispatch]);

    return (
      <div ref={ref} {...props} className="flex flex-wrap">
        {props.children}
      </div>
    );
  }
);

type StepperTriggerProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  stepNumber: number;
};

const StepTrigger = forwardRef<HTMLDivElement, StepperTriggerProps>(
  ({ stepNumber, ...props }, ref) => {
    const { state } = useStepper();
    const { activeStep } = state;
    return (
      <div
        ref={ref}
        className={classNames(
          "h-[34px] flex-1 cursor-default text-center font-semibold",
          activeStep === stepNumber && "border-b-[4px] border-mint"
        )}
        {...props}
      />
    );
  }
);

type StepperContentProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  contentNumber: number;
};

const StepContent = forwardRef<HTMLDivElement, StepperContentProps>(
  ({ contentNumber, ...props }, ref) => {
    const { state } = useStepper();

    const { activeStep } = state;

    if (contentNumber === activeStep)
      return <div ref={ref} className="w-full" {...props} />;

    return null;
  }
);

export { Stepper, StepTrigger, StepContent };
