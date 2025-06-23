import * as amplitude from "@amplitude/analytics-browser";
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

import MuiProvider from "./MuiProvider";
import StoreProvider from "./StoreProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window !== undefined) {
      amplitude.init(process.env.REACT_APP_AMPLITUDE_API_KEY as string, {
        autocapture: false,
      });
    }
  }, []);

  useEffect(() => {
    const excludedPaths = [/^\/projects\/\d+$/]; // Define excluded paths as regex patterns

    const isExcluded = excludedPaths.some((pattern) => pattern.test(pathname));

    const debounce = setTimeout(() => {
      if (!isExcluded) {
        const path = pathname.split("/").join(" ").toUpperCase();

        // Track page views on route change

        amplitude.track(`${path || "LOGIN"} Page View`);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [pathname]);
  return (
    <StoreProvider>
      <MuiProvider>{children}</MuiProvider>
    </StoreProvider>
  );
};

export default Providers;
