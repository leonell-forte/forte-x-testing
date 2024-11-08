import { ReactNode } from "react";
import Alert from "./ui/alert/alert";

const AlertProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      {children} <Alert />
    </div>
  );
};

export default AlertProvider;
