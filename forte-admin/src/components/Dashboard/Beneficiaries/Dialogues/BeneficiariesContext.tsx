import { ReactNode, createContext, useContext, useState } from "react";

interface ContextProps {
  showPrompt: boolean;
  toShowPrompt: (bool: boolean) => void;
}

const BenefeciariesContext = createContext<ContextProps | undefined>(undefined);

export const BeneficiariesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const toShowPrompt = (bool: boolean) => setShowPrompt(bool);
  return (
    <BenefeciariesContext.Provider value={{ showPrompt, toShowPrompt }}>
      {children}
    </BenefeciariesContext.Provider>
  );
};

export function useBeneficiariesContext() {
  const context = useContext(BenefeciariesContext);
  if (!context)
    throw new Error("Not used inside BenefeciariesContext provider!");
  return context;
}
