import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";

export const queryClient = new QueryClient();

interface IProp {
  children: ReactNode;
}

const QueryProvider = ({ children }: IProp) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
