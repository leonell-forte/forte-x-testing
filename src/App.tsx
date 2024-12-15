import React, { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.css";
import AlertProvider from "./components/AlertProvider";
import DashboardLayout from "./components/Dashboard/Layout";
import Providers from "./components/Providers";
import QueryProvider from "./components/QueryProvider";
import Spinner from "./components/ui/spinner/spinner";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./lib/routes";

// Lazy load components

function App() {
  return (
    <QueryProvider>
      <div>
        <div className="fixed left-0 top-0 z-[-1] h-screen w-screen bg-body-gradient"></div>
        <Router>
          <Providers>
            <AlertProvider>
              <Suspense
                fallback={
                  <DashboardLayout>
                    <div className="flex h-full w-full items-center justify-center">
                      <Spinner />
                    </div>
                  </DashboardLayout>
                }
              >
                <Routes>
                  {PUBLIC_ROUTES.map((item, index) => {
                    const { link, Component } = item;
                    return (
                      <Route key={index} path={link} element={<Component />} />
                    );
                  })}
                  {PROTECTED_ROUTES.map((item, index) => {
                    const { link, Component } = item;
                    return (
                      <Route
                        key={index}
                        path={link}
                        element={
                          <DashboardLayout>
                            <Component />
                          </DashboardLayout>
                        }
                      />
                    );
                  })}
                </Routes>
              </Suspense>
            </AlertProvider>
          </Providers>
        </Router>
      </div>
    </QueryProvider>
  );
}

export default App;
