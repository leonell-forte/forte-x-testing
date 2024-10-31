import { ReactNode, useEffect } from "react";
import StoreProvider from "./StoreProvider";
import MuiProvider from "./MuiProvider";
import { useLocation } from "react-router-dom";
import * as amplitude from "@amplitude/analytics-browser";

const Providers = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  useEffect(() => {
    if (window !== undefined) {
      amplitude.init(process.env.REACT_APP_AMPLITUDE_API_KEY as string, {
        autocapture: true,
      });
    }
  }, []);

  useEffect(() => {
    const path = location.pathname.split("/").join(" ").toUpperCase();

    // Track page views on route change
    amplitude.track(`${path || "LOGIN"} Page View`);
  }, [location]);
  return (
    <StoreProvider>
      <MuiProvider>{children}</MuiProvider>
    </StoreProvider>
  );
};

export default Providers;
