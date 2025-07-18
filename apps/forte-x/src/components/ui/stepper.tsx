import { cn } from "@repo/ui/lib/utils";
import React, {
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from "react";

const Stepper = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: string; // Required prop to determine initial active step
}) => {
  return (
    <StepperProvider defaultValue={defaultValue}>
      <div className="flex h-full">
        <div className="h-full w-[480px] space-y-10 rounded-[30px] border border-gray-400 bg-green-50/50 p-10">
          {children}
        </div>
        <div className="px-24 py-10">
          <StepperContentDisplay />
        </div>
      </div>
    </StepperProvider>
  );
};

const StepperTitle = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-[14px]">{children}</p>;
};

const StepperList = ({ children }: { children: React.ReactNode }) => {
  return <ul className="space-y-6">{children}</ul>;
};

const StepperTrigger = ({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: string;
}) => {
  const { dispatch, activeStep } = useStepper();

  const handleClick = () => {
    dispatch({ type: "SET_ACTIVE_STEP", payload: value });
  };

  const isActive = value === activeStep;

  return (
    <li
      onClick={handleClick}
      className={cn("cursor-pointer", isActive && "text-green-300")}
    >
      <div>
        <div></div>
        <div>
          <p className={cn("text-lg font-bold")}>{title}</p>
          <p className={cn("text-[14px]")}>{description}</p>
        </div>
      </div>
    </li>
  );
};

const StepperContent = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  const { registerContent } = useStepper();

  // Register this content with the context when mounted
  React.useEffect(() => {
    registerContent(value, children);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, children]);

  return null;
};

// Component to display the active step content in the sample area
const StepperContentDisplay = () => {
  const { activeStep, contentMap } = useStepper();

  if (!activeStep || !contentMap[activeStep]) {
    return <p className="text-gray-500">Select a step to view content</p>;
  }

  return (
    <div className="stepper-content-display">{contentMap[activeStep]}</div>
  );
};

type State = {
  activeStep: string;
  contentMap: Record<string, React.ReactNode>;
  registerContent: (key: string, content: React.ReactNode) => void;
  dispatch: Dispatch<Actions>;
  setActiveStep: (step: string) => void;
};

type Actions = {
  type: "SET_ACTIVE_STEP";
  payload: string;
};

const initialState: State = {
  activeStep: "", // This will be overridden by the defaultValue
  contentMap: {},
  registerContent: () => {},
  dispatch: () => {},
  setActiveStep: () => {},
};

const StepperContext = createContext(initialState);

const reducer = (state: State, action: Actions) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ACTIVE_STEP":
      return {
        ...state,
        activeStep: payload,
      };
  }
};

const StepperProvider = ({
  children,
  defaultValue,
}: PropsWithChildren<{ defaultValue: string }>) => {
  // Initialize with the defaultValue
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    activeStep: defaultValue,
  });
  const [contentMap, setContentMap] = useState<Record<string, ReactNode>>({});

  const registerContent = useCallback((key: string, content: ReactNode) => {
    setContentMap((prev) => ({
      ...prev,
      [key]: content,
    }));
  }, []);

  const setActiveStep = (step: string) => {
    dispatch({ type: "SET_ACTIVE_STEP", payload: step });
  };

  return (
    <StepperContext.Provider
      value={{
        ...state,
        contentMap,
        registerContent,
        dispatch,
        setActiveStep,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};

const useStepper = () => {
  const context = useContext(StepperContext);

  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider");
  }

  return context;
};

export {
  Stepper,
  StepperList,
  StepperTrigger,
  StepperContent,
  StepperTitle,
  useStepper,
};
