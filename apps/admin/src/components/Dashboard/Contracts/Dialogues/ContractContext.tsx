import { type ReactNode, createContext, useContext, useState } from "react";

interface ContextProps {
  showPrompt: boolean;
  toShowPrompt: (bool: boolean) => void;
}

const ContractContext = createContext<ContextProps | undefined>(undefined);

export const ContractsProvider = ({ children }: { children: ReactNode }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const toShowPrompt = (bool: boolean) => setShowPrompt(bool);
  return (
    <ContractContext.Provider value={{ showPrompt, toShowPrompt }}>
      {children}
    </ContractContext.Provider>
  );
};

export function useContractsContext() {
  const context = useContext(ContractContext);
  if (!context) throw new Error("Not used inside ContractContext provider!");
  return context;
}
